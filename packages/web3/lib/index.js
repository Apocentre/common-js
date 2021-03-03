const Record = require('@ppoliani/im-record')
const Web3 = require('web3')
const {sign, signMsg, equals: accountEquals} = require('./account')
const {Contract, calculateCreate2} = require('./Contract')
const BatchRequest = require('./BatchRequest')
const utils = require('./utils')
const abi = require('./abi')
const {Networks} = require('./network')
const {subscribe, decodeLog, getPastLogs, subscribeToBlockHeader} = require('./event')
const {craftTx, signTx, sendTx} = require('./tx')

const init = inst => (
  network,
  provider,
  blockTime=duration.seconds(15),
  blockFinality=12
) => {
  inst.network = network
  inst.web3 = new Web3(provider),
  inst.blockTime = blockTime
  inst.blockFinality = blockFinality
}

const EthBsc = Record({ 
  network: undefined,
  web3: null,
  init,
  sign,
  signMsg,
  Contract,
  BatchRequest,
  craftTx,
  signTx,
  sendTx,
  subscribe,
  decodeLog,
  getPastLogs,
  subscribeToBlockHeader
})

module.exports = {
  EthBsc,
  utils,
  abi,
  Networks,
  calculateCreate2,
  accountEquals
}
