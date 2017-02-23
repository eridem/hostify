'use strict'

module.exports = function (dep) {
  return function (options = {}) {
    const { operations, osFileResolver } = dep

    if (!options.filterIpFn && !options.filterHostFn) {
      throw Error(`No IP and Host filter function specified.`)
    }

    const whatIf = options.whatIf || false

    const hostFilePath = osFileResolver.getHostFilePath({defaultPath: options.path, throwException: true})
    const contents = osFileResolver.loadContent({ path: hostFilePath })
    let newContents = ''

    const result = operations.list(options)

    if (!whatIf) {
      const regexToMatch = []
      result.forEach(entry => {
        const ip = entry.ip.replace(/\./gi, '\\.')
        const host = entry.host.replace(/\./gi, '\\.')

        regexToMatch.push(new RegExp(`^[\\s\\t]*(${ip})[\\s\\t]+(${host})[\\s\\t]*(.*)$`, 'gi'))
      })

      contents.split('\n').forEach((val) => {
        let matched = false
        regexToMatch.forEach(regexp => { matched = matched || regexp.test(val.trim()) })

        if (!matched) {
          newContents += val + '\n'
        }
      })

      osFileResolver.saveContent({ path: hostFilePath, contents: newContents })
    }

    return result
  }
}
