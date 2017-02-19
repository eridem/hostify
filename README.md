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
| `list` | Show a list of entries | `hostify list` |
| `list --ipFilterExp` | Filter IPs by RegExp | `hostify list --ipFilterExp ".*\.255"` |
| `list --hostFilterExp` | Filter Hosts by RegExp | `hostify list<tr> --hostFilterExp ".*tracking.*"` |

## Module interface

Import module with:

```javascript
const hostify = require('hostify').operations
```

### Operations

#### `hostify.list(options): <Array>{ ip: string, host: string }`

Show a list of entries

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
