'use strict'

module.exports = function (dep) {
  return {
    isIp: function (ipStr) {
      ipStr = ipStr || ''
      ipStr = ipStr.trim()

      return /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/gi.exec(ipStr)
    },
    isHost: function (hostStr) {
      return typeof hostStr !== 'string' && hostStr.trim() !== ''
    },
    isEntryValid: function (entry) {
      return this.isIp(entry.ip) && !this.isHost(entry.host)
    }
  }
}
