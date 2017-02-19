# Hostify

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

Operations:

| Function | Description | Arguments | Output | Example |
|:-- |:-- |:-- |:-- |:-- |
| `hostify.list` | Show a list of entries | `filterIpFn: (val) => boolean`<br /><br />`filterHostFn: (val) => boolean` | `<Array>{ ip: string, host: string }` | `const entries = hostify.list({ filterIpFn: (val) => return val.endsWith('.255') })`