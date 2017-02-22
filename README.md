[![Build Status][travis-image]][travis-url]
[![Coverage Status][coveralls-image]][coveralls-url]
[![NPM version][npm-image]][npm-url]
[![js-standard-style][standard-image]][standard-url]

[travis-url]: https://travis-ci.org/eridem/hostify
[travis-image]: https://img.shields.io/travis/eridem/hostify/master.svg
[standard-url]: http://standardjs.com/
[standard-image]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[npm-url]: https://www.npmjs.com/package/hostify
[npm-image]: https://img.shields.io/npm/v/hostify.svg
[coveralls-url]: https://coveralls.io/github/eridem/hostify?branch=master
[coveralls-image]: https://coveralls.io/repos/github/eridem/hostify/badge.svg?branch=master

# Hostify

![Icon](./doc/icon.png) 

*Hostify* is a module that help us to work with the `hosts` file of our operating system.

It supports both a CLI tool and a module you can use in your own project.

> *NOTE: library in progress. Future releases will contain more operations.*

## CLI tool operations

```bash
# Usage
hostify [COMMAND] [OPTIONS]

# For help
hostify --help
hostify [COMMAND] --help
```

| Command | Description | Example
|:-- |:-- |:-- |
| `list` | Show all entries in the host file | `hostify list` |
| `list --ipFilterExp [REGEXP]` | Show entries which IPs match with RegExp | `hostify list --ipFilterExp ".*\.255"` |
| `list --hostFilterExp [REGEXP]` | Show entries which Host match with RegExp | `hostify list --hostFilterExp ".*tracking.*"` |
| `delete --ipFilterExp [REGEXP]` | Delete entries which IPs match with RegExp | `hostify delete --ipFilterExp "127.0.0.\d+"` |
| `delete --hostFilterExp [REGEXP]` | Delete entries which Host match with RegExp | `hostify delete --hostFilterExp ".*project\.local"` |
| `delete --what-if` | Combined with other options, show results of the `delete` operation without perform it | `hostify delete --what-if --ipFilterExp "127.0.0.0"` |

### Special options

| Option | Description | Example
|:-- |:-- |:-- |
| `--path` | Specify path of another `hosts` file | `hostify list --path ./my-hosts.txt` |

## Module interface

Import module with:

```javascript
const hostify = require('hostify').operations
```

### Operations

#### `hostify.list(options): <Array>{ ip: string, host: string }`

Show entries in the host file.

| Option | Model |
|:-- |:-- |
| `filterIpFn` | `filterIpFn: (val: string) => boolean` |
| `filterHostFn` | `filterHostFn: (val: string) => boolean` |

```javascript
const options = {
  filterIpFn: (val) => val.endsWith('.255'),       // Filter IPs
  filterHostFn: (val) => val.contains('tracking')  // Filter Hosts
}

const entries = hostify.list(options)

entries.forEach(entry => console.log(entry.ip, entry.host))
```

#### `hostify.delete(options): <Array>{ ip: string, host: string }`

Delete entries in the host file.

| Option | Model |
|:-- |:-- |
| `filterIpFn` | `filterIpFn: (val: string) => boolean` |
| `filterHostFn` | `filterHostFn: (val: string) => boolean` |
| `whatIf` | `whatIf: boolean` |

```javascript
const options = {
  filterIpFn: (val) => val.endsWith('.255'),       // Filter IPs
  filterHostFn: (val) => val.contains('tracking'), // Filter Hosts
  whatIf: true                                     // Do not execute delete operation, only obtain results
}

const entries = hostify.delete(options)

entries.forEach(entry => console.log(entry.ip, entry.host))
```