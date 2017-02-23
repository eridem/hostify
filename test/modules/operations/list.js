/* global describe, it */

const { join } = require('path')
const chai = require('chai')
chai.should()
const expect = chai.expect

const file = 'operations/list.js'
const target = require(join(__dirname, '../../../lib/modules/', file))

describe(file, function () {
  const osFileResolverMock = function (content) {
    return {
      getHostFilePath: () => '/file',
      loadContent: () => content
    }
  }

  describe('using .list()', function () {
    it('should return parsed entries without filters', function () {
      const content = `
        0.0.0.0 localhost\n
        0.0.0.0 local\n
        1.2.3.4 another#host\n
        5.6.7.8 #invalid.host\n
        #1.1.1.1 invalid.me\n
        abc.def.ghi.jkl invalid.local\n
        # commented line\n
        #commented line\n
        \n
        #1.1.1.1 hostify\n
        255.255.255.255 broadcast #broadcast`

      const result = [
        { ip: '0.0.0.0', host: 'localhost', comment: '' },
        { ip: '0.0.0.0', host: 'local', comment: '' },
        { ip: '1.2.3.4', host: 'another', comment: '#host' },
        { ip: '255.255.255.255', host: 'broadcast', comment: '#broadcast' }]

      const osFileResolver = osFileResolverMock(content)
      const list = target({osFileResolver})

      const entries = list()
      expect(entries).to.eql(result)
    })

    it('should return parsed entries with IP filters', function () {
      const content = `
        0.0.0.0 one.local\n
        0.0.0.0 two.local\n
        0.0.1.0 three.local\n
        0.1.0.0 four.local\n
      `

      const osFileResolver = osFileResolverMock(content)
      const list = target({osFileResolver})

      const filterIpFn = function (ip) { return ip.startsWith('0.0') }
      const entries = list({ filterIpFn })
      expect(entries).to.eql([
        { ip: '0.0.0.0', host: 'one.local', comment: '' },
        { ip: '0.0.0.0', host: 'two.local', comment: '' },
        { ip: '0.0.1.0', host: 'three.local', comment: '' }]
      )
    })

    it('should return parsed entries with Hosts filters', function () {
      const content = `
        0.0.0.0 one.local\n
        0.0.0.0 two.local\n
        0.0.1.0 three.local\n
        0.1.0.0 four.local\n
      `

      const osFileResolver = osFileResolverMock(content)
      const list = target({osFileResolver})

      const filterHostFn = function (host) { return host.endsWith('e.local') }
      const entries = list({ filterHostFn })
      expect(entries).to.eql([
        { ip: '0.0.0.0', host: 'one.local', comment: '' },
        { ip: '0.0.1.0', host: 'three.local', comment: '' }]
      )
    })

    it('should return parsed entries with IP and Hosts filters', function () {
      const content = `
        0.0.0.0 one.local\n
        0.0.0.0 two.local\n
        0.0.1.0 three.local\n
        0.1.0.0 four.local\n
      `

      const osFileResolver = osFileResolverMock(content)
      const list = target({osFileResolver})

      const filterIpFn = function (ip) { return ip.endsWith('0.0') }
      const filterHostFn = function (host) { return host.endsWith('e.local') }

      const entries = list({ filterIpFn, filterHostFn })
      expect(entries).to.eql([
        { ip: '0.0.0.0', host: 'one.local', comment: '' }]
      )
    })
  })
})
