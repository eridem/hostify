'use strict'

module.exports = function (dep) {
  return {
    getHostFilePath: function () {
      const { fs, path, process } = dep
      const possibleHostPaths = [
        '/etc/hosts',
        path.join(process.env.windir || '', '/System32/drivers/etc/hosts')
      ]

      const matches = possibleHostPaths.filter(hostPath => fs.existsSync(hostPath))

      return matches.length ? matches[0] : null
    }
  }
}
