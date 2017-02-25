'use strict'

module.exports = function (dep) {
  let cmd = {}

  cmd.command = 'add'
  cmd.desc = 'Add entry in the host file'
  cmd.builder = {
    path: {
      alias: 'p',
      describe: 'Path to resolve the hosts file. E.g. ./my-hosts.txt',
      demand: false,
      type: 'string'
    },
    ip: {
      alias: 'i',
      describe: 'IP address to add. E.g. "127.0.0.1"',
      demand: true,
      type: 'string'
    },
    host: {
      alias: 'h',
      describe: 'Host to add. E.g. "localhost"',
      demand: true,
      type: 'string'
    },
    comment: {
      alias: 'c',
      describe: 'Add comment to entry. E.g. "Advert entry"',
      demand: false,
      type: 'string'
    }
  }
  cmd.handler = function (argv) {
    const { operations, print } = dep
    const { path, ip, host, comment } = argv

    const result = operations.add({
      path,
      entries: [{ ip, host, comment }]
    })

    print.printEntries(result)
  }

  return cmd
}
