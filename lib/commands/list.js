'use strict'

module.exports = function (dep) {
  let cmd = {}

  cmd.command = 'list'
  cmd.desc = 'Show entries in the host file'
  cmd.builder = {
    ipFilterExp: {
      alias: 'i',
      describe: 'Filter IP by RegExp. E.g. 127.0.0.1',
      demand: 'false',
      type: 'string',
      default: '.*'
    },
    hostFilterExp: {
      alias: 'h',
      describe: 'Filter Host by RegExp. E.g. .*\\.github.com',
      demand: 'false',
      type: 'string',
      default: '.*'
    }
  }
  cmd.handler = function (argv) {
    const { console, colors, operations } = dep
    const { ipFilterExp, hostFilterExp } = argv
    const result = operations.list({
      filterIpFn: function (v) {
        return new RegExp(`^${ipFilterExp}$`).test(v)
      },
      filterHostFn: function (v) {
        return new RegExp(`^${hostFilterExp}$`).test(v)
      }
    })

    result.forEach(entry => console.log(colors.gray(entry.ip), colors.green(entry.host)))
  }

  return cmd
}
