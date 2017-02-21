'use strict'

module.exports = function (dep) {
  let cmd = {}

  cmd.command = 'list'
  cmd.desc = 'Show entries in the host file'
  cmd.builder = {
    path: {
      alias: 'p',
      describe: 'Path to resolve the hosts file. E.g. ./my-hosts.txt',
      demand: false,
      type: 'string'
    },
    ipFilterExp: {
      alias: 'i',
      describe: 'Filter IP by RegExp. E.g. 127.0.0.1',
      demand: false,
      type: 'string',
      default: '.*'
    },
    hostFilterExp: {
      alias: 'h',
      describe: 'Filter Host by RegExp. E.g. .*\\.github.com',
      demand: false,
      type: 'string',
      default: '.*'
    }
  }
  cmd.handler = function (argv) {
    const { operations, print } = dep
    const { path, ipFilterExp, hostFilterExp } = argv
    const result = operations.list({
      path,
      filterIpFn: function (v) {
        return new RegExp(`^${ipFilterExp}$`).test(v)
      },
      filterHostFn: function (v) {
        return new RegExp(`^${hostFilterExp}$`).test(v)
      }
    })

    print.printEntries(result)
  }

  return cmd
}
