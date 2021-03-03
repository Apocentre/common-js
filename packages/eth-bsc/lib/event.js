const logger = require('@apocentre/logger')
const {duration} = require('@apocentre/common')

const findInterface = (contract, eventName) => contract
  .options
  .jsonInterface
  .find(e => e.name === eventName && e.type === 'event')

const subscribe = inst => (contract, eventName, fromBlock) => {
  const eventInterface = findInterface(contract, eventName)
  const opts = {
    address: contract.options.address,
    topics: [eventInterface.signature]
  }

  return inst.web3.eth.subscribe('logs', opts)
    .on('connected', () => {
      logger.info(`Start listening to ${eventName}`)
    })
    .on('error', error => {
      logger.error(`Error listening to ${eventName}: ${error.message}`)
    })
}

const decodeLog = inst => (contract, eventName, result) => {
  const eventInterface = findInterface(contract, eventName)

  return inst.web3.eth.abi.decodeLog(
    eventInterface.inputs,
    result.data,
    result.topics.slice(1)
  )
}

const getPastLogs = inst => async (contract, eventName, fromBlock, toBlock) => {
  const eventInterface = findInterface(contract, eventName)
  const opts = {
    address: contract.options.address,
    topics: [eventInterface.signature],
    fromBlock,
    toBlock
  }

  const results = await inst.web3.eth.getPastLogs(opts)
  
  return results.map(result => ({
    txHash: result.transactionHash,
    blockNumber: result.blockNumber,
    logIndex: result.logIndex,
    values: decodeLog(inst)(contract, eventName, result)
  }))
}

const subscribeToBlockHeader = inst => (processDelay, onData, onError) => {
  // BSC doesn't offer a WS server; so we will have to emulate web3.eth.subscribe('newBlockHeaders')
  // with a simple polling
  const intervalId = setInterval(async () => {
    try {
      const number = await inst.web3.eth.getBlockNumber()

      // Delay the processing for 5 secs. This should in theory
      // give enough time for the logs to be indexed by the JSON-RPC node i.e. infura
      // before we call getPastLogs. A good example of this issue is a Transfer event
      // at block #11659557. The block that this function loaded on the 15sec interval
      // was this https://etherscan.io/block/11659558. So the getPastLogs tried to get
      // events for the range [11659555, 11659558]. However, infura didn't return any events
      // The reason might be that 11659558 was mined in 2 secs. So there was 2 secs between 11659557 and 11659558
      // which apparently was not enough to get the logs registered on infura. I might be that  getBlockNumber hit
      // on infura node and getPastLogs git another which was not fully synced. In any case the result is that
      // the Transfer event was returned.
      // In addition to that there is always the possibility of chain reorganization that might cause logIndex
      // values to change. https://ethereum.stackexchange.com/questions/37437/log-index-change-during-chain-reorganization.
      // To avoid that we will give 12 blocks space (3 mins) which is a fairly safe delay to avoid processing anything
      // which due to reorg might change.
      setTimeout(() => {
        onData({number})
      }, processDelay)
    }
    catch(error) {
      onError(error)
    }
  }, duration.seconds(10))

  return {
    unsubscribe: () => {
      clearInterval(intervalId)
    }
  }
}

module.exports = {
  subscribe,
  decodeLog,
  getPastLogs,
  subscribeToBlockHeader
}
