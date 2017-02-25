'use strict'

module.exports = function (dep) {
  function isValidOrException (entries) {
    const { ipUtils } = dep

    if (!(entries instanceof Array)) {
      throw new Error('Entries must be an array of {"ip": string, "host": string}')
    }
    entries.forEach(entry => {
      if (!ipUtils.isEntryValid(entry)) {
        throw new Error(`Entry "${entry.toString()}" is invalid`)
      }
    })
  }

  function getAllEntries (options) {
    const { operations } = dep
    return operations.list(options)
  }

  function appendContentsToHostFile ({newContents, options}) {
    const { osFileResolver } = dep

    const hostFilePath = osFileResolver.getHostFilePath({defaultPath: options.path, throwException: true})
    const contents = osFileResolver.loadContent({ path: hostFilePath })
    const endLine = contents.endsWith('\n') ? '' : '\n'
    osFileResolver.saveContent({ path: hostFilePath, contents: contents + endLine + newContents })
  }

  function isSameEntry (firstEntry, secondEntry) {
    return firstEntry.host.toLowerCase() === secondEntry.host.toLowerCase() &&
           firstEntry.ip.toLowerCase() === secondEntry.ip.toLowerCase()
  }

  return function (options = {}) {
    const { entries } = options

    isValidOrException(entries)
    const allEntries = getAllEntries(options)

    let newContents = ''
    let result = []

    entries.forEach(entry => {
      const exists = allEntries.filter(current => isSameEntry(entry, current)).length > 0
      entry.comment = entry.comment || ''

      if (!exists) {
        const appendComment = (entry.comment ? ` # ${entry.comment}` : '')
        newContents += `${entry.ip} ${entry.host}${appendComment}\n`
        result.push(entry)
      }
    })

    appendContentsToHostFile({newContents, options})

    return result
  }
}
