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

![Icon](https://github.com/eridem/hostify/raw/master/doc/icon.png) 

*Hostify* is a module that help us to work with the `hosts` file of our operating system.

It supports both a CLI tool and a module you can use in your own project.

> *NOTE: library in progress. Please use with caution and report any issue on here: <https://github.com/eridem/hostify/issues>*

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
| `list --ipFilterExp "REGEXP"` | Show entries which IPs match with RegExp | `hostify list --ipFilterExp ".*\.255"` |
| `list --hostFilterExp "REGEXP"` | Show entries which Host match with RegExp | `hostify list --hostFilterExp ".*tracking.*"` |
| `list --ipFilterExp "REGEXP" --hostFilterExp "REGEXP"` | Show entries which IP and Host match with both each RegExp | `hostify list --ipFilterExp "0.0.0.0" --hostFilterExp ".*tracking.*"` |
| `add --ip "IP" --host "HOST" [--comment "COMMENT"]` | Add a single entry to the `hosts` file | `hostify add --ip "0.0.0.0" --host "tracking.localhost" --comment "Tracking entry"` |
| `delete --ipFilterExp "REGEXP" [--what-if]` | Delete entries which IPs match with RegExp | `hostify delete --ipFilterExp "127.0.0.\d+"` |
| `delete --hostFilterExp "REGEXP" [--what-if]` | Delete entries which Host match with RegExp | `hostify delete --hostFilterExp ".*project\.local"` |

### Special options

| Option | Description | Example
|:-- |:-- |:-- |
| `--path` | Specify path of another `hosts` file | `hostify list --path ./my-hosts.txt` |

## Module interface

Import module with:

```javascript
const hostify = require('hostify').operations
```

### List

```typescript
hostify.list(options): <Array>{ ip: string, host: string }`
```

Show entries in the host file.

| Option | Model | Default |
|:-- |:-- |:-- |
| `filterIpFn` | `filterIpFn: (val: string) => boolean` | `(v) => true` |
| `filterHostFn` | `filterHostFn: (val: string) => boolean` | `(v) => true` |
| `path` | `path: string` | OS hosts path |

```javascript
const options = {
  filterIpFn: (val) => val.endsWith('.255'),       // Filter IPs
  filterHostFn: (val) => val.contains('tracking')  // Filter Hosts
  // path: './my-hosts-file.txt'                   // Hosts file
}

const entries = hostify.list(options)

entries.forEach(entry => console.log(entry.ip, entry.host, entry.comment))
```

### Add

```typescript
hostify.add(options): <Array>{ ip: string, host: string }
```

Add entries in the host file.

| Option | Model | Default |
|:-- |:-- |:-- |
| `entries` | `<Array>{ ip: string, host: string, comment: string }` | `null` |
| `path` | `path: string` | OS hosts path |

```javascript
const options = {
  entries: [                                       // Entries to add
    { ip: '0.0.0.0', host: 'ad.localhost' },
    { ip: '0.0.0.0', host: 'tracking.localhost', comment: 'Track entry' }
  ],
  // path: './my-hosts-file.txt'                   // Hosts file
}

const entries = hostify.add(options)

entries.forEach(entry => console.log(entry.ip, entry.host, entry.comment))
```

### Delete

```typescript
hostify.delete(options): <Array>{ ip: string, host: string }
```

Delete entries in the host file.

| Option | Model | Default |
|:-- |:-- |:-- |
| `filterIpFn` | `filterIpFn: (val: string) => boolean` | `(v) => true` |
| `filterHostFn` | `filterHostFn: (val: string) => boolean` | `(v) => true` |
| `whatIf` | `whatIf: boolean` | `false` |
| `path` | `path: string` | OS hosts path |

```javascript
const options = {
  filterIpFn: (val) => val.endsWith('.255'),       // Filter IPs
  filterHostFn: (val) => val.contains('tracking'), // Filter Hosts
  whatIf: true                                     // Do not execute delete operation, only obtain results
  // path: './my-hosts-file.txt'                   // Hosts file
}

const entries = hostify.delete(options)

entries.forEach(entry => console.log(entry.ip, entry.host, entry.comment))
```