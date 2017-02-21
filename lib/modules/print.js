'use strict'

module.exports = function (dep) {
  return {
    printEntries: function (entries) {
      const { console, colors } = dep
      entries.forEach(entry => console.log(colors.gray(entry.ip), entry.ip.length > 14 ? '' : '\t', colors.green(entry.host), '\t', colors.red(entry.comment || '')))
    }
  }
}
