const Web3 = require('web3')

const web3Utils = (new Web3()).utils

module.exports = {
  padLeft: web3Utils.padLeft,
  numberToHex: web3Utils.numberToHex,
  hexToNumber: web3Utils.hexToNumber,
  toHex: web3Utils.toHex,
  toWei: web3Utils.toWei,
  soliditySha3: web3Utils.soliditySha3,
  keccak256: web3Utils.keccak256,
  BN: web3Utils.BN,
  fromWei: num => web3Utils.fromWei(num, 'ether'),
  randomHex: (size=32) => web3Utils.randomHex(size)
}
