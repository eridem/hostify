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
    it('it should return parsed entries no commented without filters', function () {
      const tests = [
        {
          content: `
                    0.0.0.0 localhost\n
                    0.0.0.0 local
                `,
          result: [
            { ip: '0.0.0.0', host: 'localhost', comment: '' },
            { ip: '0.0.0.0', host: 'local', comment: '' }
          ]
        }
      ]

      tests.forEach(testCase => {
        const osFileResolver = osFileResolverMock(testCase.content)
        const list = target({osFileResolver})

        const entries = list()
        expect(entries).to.eql(testCase.result)
      })
    })
  })
})
