let InstaMojoClient = function(username, password) {
  this.Invoices = require('./src/invoices')(username, password)
}
module.exports = function(username, password) {
  return new InstaMojoClient(username, password);
}