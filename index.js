'use strict'

const __rootdirname = __dirname
const path = require('path')
const camelCase = require('camelcase')
const requireDir = require('require-dir')
const fs = require('fs')
const colors = require('chalk')

// External dependencies to pass to the commands
let dep = { path, console, fs, process, __rootdirname, colors }

// Internal dependencies
const inDepFns = requireDir(path.join(__rootdirname, 'lib', 'modules'), { camelcase: true, recurse: true })

// Internal dependencies as tree
function resolveInternalDependencies (src, dst) {
  Object.keys(src).forEach(name => {
    if (typeof src[name] === 'function') {
      dst[camelCase(name)] = src[name](dep)
    } else {
      dst[camelCase(name)] = {}
      resolveInternalDependencies(src[name], dst[camelCase(name)])
    }
  })
}
resolveInternalDependencies(inDepFns, dep)

// Load commands from folder and pass dependencies
const commandsFn = requireDir(path.join(__dirname, 'lib', 'commands'))
const commands = Object.keys(commandsFn).map((i) => commandsFn[i](dep))

// Export commands and modules separatelly
module.exports = { commands, modules: dep, operations: dep.operations }
