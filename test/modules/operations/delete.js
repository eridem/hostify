/* global describe, it */

const { join } = require('path')
const chai = require('chai')
chai.should()
const expect = chai.expect

const file = 'operations/delete.js'
const target = require(join(__dirname, '../../../lib/modules/', file))

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

  before(function() {
    latestSavedResult = null
  })

  describe('using .delete()', function () {
    it('should return error if no filter specified', function () {
      const osFileResolver = osFileResolverMock(``)
      const del = target({osFileResolver})

      expect(() => {
        del()}).to.throw(Error)
    })

    it('should delete entries', function () {
      const plainTextInput = `
0.0.0.0 localhost
0.0.0.0 local
1.2.3.4 another#host
5.6.7.8 #invalid.host
#1.1.1.1 invalid.me
abc.def.ghi.jkl invalid.local
# commented line
#commented line

#1.1.1.1 hostify
255.255.255.255 broadcast #broadcast
`
      const fileResult = `
1.2.3.4 another#host
5.6.7.8 #invalid.host
#1.1.1.1 invalid.me
abc.def.ghi.jkl invalid.local
# commented line
#commented line

#1.1.1.1 hostify
255.255.255.255 broadcast #broadcast
`
      const input = [
        { ip: '0.0.0.0', host: 'localhost', comment: '' },
        { ip: '0.0.0.0', host: 'local', comment: '' }
      ]
      const filterIpFn = () => true
      const operations = { list: () => { return input }}
      const osFileResolver = osFileResolverMock(plainTextInput)

      const del = target({osFileResolver, operations})
      const entries = del({ filterIpFn })

      expect(entries).to.eql(input)
      expect(latestSavedResult).to.equal(fileResult)
    })
  })
})
