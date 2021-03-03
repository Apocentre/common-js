const Web3 = require('web3')

const abi = (new Web3()).eth.abi

module.exports = {
  encodeParameters: abi.encodeParameters.bind(abi)
}
