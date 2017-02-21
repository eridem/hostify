'use strict'

module.exports = function (dep) {
  return function (options = {}) {
    const filterIpFn = options.filterIpFn || (() => true)
    const filterHostFn = options.filterHostFn || (() => true)

    const { fs, osFileResolver } = dep
    const result = []

    const hostFilePath = osFileResolver.getHostFilePath({defaultPath: options.path, throwException: true})
    const contents = osFileResolver.loadContent({ path: hostFilePath })

    contents.split('\n').forEach((val) => {
      const entryRegExp = /^[\s\t]*(\d+\.\d+\.\d+\.\d+)[\s\t]+([^\#\s\t]+)[\s\t]*(.*)$/gi
      const matches = entryRegExp.exec(val.trim())

      if (matches) {
        const ip = matches[1]
        const host = matches[2]
        const comment = matches[3]

        if (filterIpFn(ip) && filterHostFn(host)) {
          result.push({ ip, host, comment })
        }
      }
    })

    return result
  }
}
