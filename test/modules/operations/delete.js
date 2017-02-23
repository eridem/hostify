/* global describe, it */

const { join } = require('path')
const chai = require('chai')
chai.should()
const expect = chai.expect

const file = 'operations/delete.js'
const target = require(join(__dirname, '../../../lib/modules/', file))

describe(file, function () {
  const osFileResolverMock = function (content) {
    return {
      getHostFilePath: () => '/file',
      loadContent: () => content,
      saveContent: (result) => {
        this.savedResult = result}
    }
  }

  describe('using .delete()', function () {
    it('should return error if no filter specified', function () {
      const osFileResolver = osFileResolverMock(``)
      const del = target({osFileResolver})

      expect(() => { del() }).to.throw(Error)
    })
  })
})
