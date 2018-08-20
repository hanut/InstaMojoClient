const expect = require('chai').expect
const testModule = require('../index.js')
const USERNAME = process.env.INSTAMOJO_USERNAME || ""
const PASSWORD = process.env.INSTAMOJO_PASSWORD || ""


describe('Integrity Check', function() {
  it('should export a function', function() {
    expect(testModule).is.a('function')
  })
})

describe('Functional Tests', function() {

  it('should download the report file for a valid month+year', function(done) {
    this.timeout(20000)
    testModule(2018, 6, USERNAME, PASSWORD).then(response => {
      console.log(response)
      done()
    }).catch(error => {
      done(error)
    })
  })

})