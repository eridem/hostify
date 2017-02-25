/* global describe, it */

const { join } = require('path')
const chai = require('chai')
chai.should()
const expect = chai.expect

const file = 'operations/add.js'
const target = require(join(__dirname, '../../../lib/modules/', file))
const ipUtils = require(join(__dirname, '../../../lib/modules/ip-utils.js'))()

describe(file, function () {
  let latestSavedResult = null

  const osFileResolverMock = function (content) {
    return {
      getHostFilePath: () => '/file',
      loadContent: () => content,
      saveContent: (result) => {
        latestSavedResult = result.contents
      }
    }
  }

  before(function () {
    latestSavedResult = null
  })

  describe('using .add()', function () {
    it('should return error if entries are invalid', function () {
      const osFileResolver = osFileResolverMock(``)
      const add = target({osFileResolver})

      expect(() => { add([ { ip: '300.300.300.300', host: 'localhost' } ]) }).to.throw(Error)
      expect(() => { add([ { ip: '0.0.0.0', host: '' } ]) }).to.throw(Error)
      expect(() => { add([ { ip: null, host: 'localhost' } ]) }).to.throw(Error)
      expect(() => { add([ { ip: '0.0.0.0', host: null } ]) }).to.throw(Error)
      expect(() => { add([ { ip: '0.0.0.0', host: 'localhost' }, { ip: '300.300.300.300', host: 'localhost' } ]) }).to.throw(Error)
      expect(() => { add([ { ip: '0.0.0.0', host: 'localhost' }, { ip: '0.0.0.0', host: '' } ]) }).to.throw(Error)
      expect(() => { add([ { ip: '0.0.0.0', host: 'localhost' }, { ip: null, host: 'localhost' } ]) }).to.throw(Error)
      expect(() => { add([ { ip: '0.0.0.0', host: 'localhost' }, { ip: '0.0.0.0', host: null } ]) }).to.throw(Error)
    })

    it('should not add entries if entries are empty', function () {
      const plainTextInput = `
0.0.0.0 localhost
`
      const fileResult = plainTextInput
      const input = [
        { ip: '0.0.0.0', host: 'localhost', comment: '' }]
      const itemsToAdd = []

      const operations = { list: () => {return input}}
      const osFileResolver = osFileResolverMock(plainTextInput)

      const add = target({osFileResolver, operations, ipUtils})
      const entries = add({entries: itemsToAdd})

      expect(entries).to.eql(itemsToAdd)
      expect(latestSavedResult).to.equal(fileResult)
    })

    it('should add entries', function () {
      const plainTextInput = `
0.0.0.0 localhost
`
      const fileResult = `
0.0.0.0 localhost
0.0.0.0 new.item
0.0.0.0 another.item
`
      const input = [
        { ip: '0.0.0.0', host: 'localhost', comment: '' },
        { ip: '0.0.0.0', host: 'local', comment: '' },
        { ip: '1.2.3.4', host: 'another', comment: '#host' },
        { ip: '255.255.255.255', host: 'broadcast', comment: '#broadcast' }]
      const itemsToAdd = [
        { ip: '0.0.0.0', host: 'new.item', comment: '' },
        { ip: '0.0.0.0', host: 'another.item', comment: '' }
      ]

      const operations = { list: () => {return input}}
      const osFileResolver = osFileResolverMock(plainTextInput)

      const add = target({osFileResolver, operations, ipUtils})
      const entries = add({entries: itemsToAdd})

      expect(entries).to.eql(itemsToAdd)
      expect(latestSavedResult).to.equal(fileResult)
    })
  })
})
