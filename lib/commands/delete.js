'use strict'

module.exports = function (dep) {
  let cmd = {}

  cmd.command = 'delete'
  cmd.desc = 'Delete entries in the host file'
  cmd.builder = {
    ['what-if']: {
      alias: 'wi',
      describe: 'Display the result of the operation without perform it.',
      demand: false,
      type: 'boolean',
      default: false
    },
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
    const { console, colors, operations, print } = dep
    const { path, whatIf, ipFilterExp, hostFilterExp } = argv

    if (ipFilterExp === '.*' && hostFilterExp === '.*' ) {
      throw Error(`No IP or Host filter specified or filters be ${colors.gray('".*"')}.\nUse the options ${colors.gray('--ipFilterExp [REGEXP]')} and/or ${colors.gray('--hostFilterExp [REGEXP]')}`)
    }

    const result = operations.delete({
      path,
      whatIf,
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
