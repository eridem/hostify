'use strict'

module.exports = function (dep) {
  return {
    getHostFilePath: function ({ defaultPath, throwException }) {
      const { fs, process, path } = dep
      const nodePath = dep.path

      let result

      if (defaultPath) {
        if (fs.existsSync(defaultPath)) {
          result = defaultPath
        }
      } else {
        const possibleHostPaths = [
          '/etc/hosts',
          path.join(process.env.windir || '', '/System32/drivers/etc/hosts')
        ]

        const matches = possibleHostPaths.filter(hostPath => fs.existsSync(hostPath))
        result = matches.length ? matches[0] : null
      }

      if (!result) {
        throw new Error('Cannot find hosts file or your OS may not be supported yet.')
      }

      return result
    },
    loadContent: function({ path }) {
       const { fs } = dep
       return fs.readFileSync(path).toString() || ''
    },
    saveContent: function({ path, contents }) {
       const { fs } = dep
       return fs.writeFileSync(path, contents)
    },
    getLineAsString: function({ ip, host }) {
      // ^[\s\t]*(0\.0\.0\.0)[\s\t]+(advert\.localhost)([\s\t]+.*)?$
    }
  }
}
