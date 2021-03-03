const Web3 = require('web3')
const {Networks} = require('./constants')

let _ethWeb3 = null
let _bscWeb3 = null

const createEthWeb3 = provider => {
  _ethWeb3 = new Web3(provider)
}

const createBscWeb3 = provider => {
  _bscWeb3 = new Web3(provider)
}

const web3 = (network=Networks.ETHEREUM) => network === Networks.ETHEREUM
  ? _ethWeb3
  : _bscWeb3

const init = (ethProvider, bscProvider) => {
  createEthWeb3(ethProvider)
  createBscWeb3(bscProvider)
}

module.exports = {
  init,
  web3,
  createBscWeb3
}
