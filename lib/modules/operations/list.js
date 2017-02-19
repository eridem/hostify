'use strict'

module.exports = function (dep) {
  return function (options = {}) {
    const filterIpFn = options.filterIpFn || (() => true)
    const filterHostFn = options.filterHostFn || (() => true)

    const { fs, osFileResolver } = dep
    const result = []
    const hostFilePath = osFileResolver.getHostFilePath()

    if (!hostFilePath) {
      throw new Error('Cannot find hosts file. Your OS may not be supported yet.')
    }

    const contents = fs.readFileSync(hostFilePath).toString() || ''
    contents.split('\n').forEach((val) => {
      let cleanLine = val.trim().replace(/(\t)|(\s+)/gi, ' ')
      if (cleanLine.startsWith('#') || cleanLine.split(' ').length < 2) return

      const ip = cleanLine.split(' ')[0]
      const host = cleanLine.split(' ')[1]

      if (filterIpFn(ip) && filterHostFn(host)) {
        result.push({ ip, host })
      }
    })

    return result
  }
}
