const expect = require('chai').expect;
const testModule = require('../index.js');
const USERNAME = process.env.INSTAMOJO_USERNAME || "";
const PASSWORD = process.env.INSTAMOJO_PASSWORD || "";


describe('Integrity Check', function() {
  it('should export a function', function() {
    expect(testModule).is.a('function');
  })
})

describe('Functional Tests', function() {

})