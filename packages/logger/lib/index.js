const {isBrowser} = require('browser-or-node')

if(isBrowser) {
  module.exports = require('./browserLogger')
}
else {
  module.exports = require('./nodeLogger')
}
