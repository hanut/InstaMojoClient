const expect = require('chai').expect
const testModule = require('../src/invoices.js')
const USERNAME = process.env.INSTAMOJO_USERNAME || ""
const PASSWORD = process.env.INSTAMOJO_PASSWORD || ""

describe('Invoices Module', function() {

  describe('Integrity Check', function() {

    before(() => {
      invoiceClient = testModule(USERNAME, PASSWORD);
    })

    it('should export a function', function() {
      expect(testModule).is.an('function')
    })

    it('exported function should return an object with a download method', function() {
      expect(invoiceClient).is.an('object');
      expect(invoiceClient.download).is.a('function');
    })

  })

  describe('Functional Tests', function() {

    it('should download the report file for a valid month+year', function(done) {
      this.timeout(30000)
      invoiceClient.download(2017, 6, USERNAME, PASSWORD).then(response => {
        console.log(response)
        done()
      }).catch(error => {
        done(error)
      })
    })

  })

})