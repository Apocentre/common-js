const Record = require('@ppoliani/im-record')
const logger = require('@hotcrosscom/logger')
const {EthBsc} = require('@hotcrosscom/eth-bsc')
const {duration} = require('@hotcrosscom/common')


const loadEvents = inst => async latestBlock => {
  try {
    const startingBlock = Number(
      inst.latestFetchedBlock
        ? inst.latestFetchedBlock
        : await inst.contractRepository.getContractBlockNumber(inst)
    )

    logger.info(`Load events for blocks ${[startingBlock, latestBlock]} on ${network}`)

    const logs = await inst.ethBsc.getPastLogs(
      inst.contractRepository.getContract(inst),
      inst.event, 
      startingBlock,
      latestBlock
    )

    logger.info(`${logs.length} events fetched from ${network}`)

    await inst.processLogs(logs, startingBlock)

    // We're updating the local value, however nothing guarantees that the process logs will be successful.
    // That's responsibility of the caller which would need to restart the listener passing the correct startingBlock
    // if an error occurs
    inst.latestFetchedBlock = latestBlock + 1
  }
  catch(error) {
    inst.onError(error)
  }
}

const listen = inst => {
  const onData = async (data) => {
    inst.onBlockHeader(data)
    await loadEvents(inst)(data.number)
  }

  return inst.ethBsc.subscribeToBlockHeader(
    inst.processDelay,
    onData, 
    inst.onError
  )
}

const init = inst => (network, provider, processDelay=duration.minutes(3)) => {
  inst.ethBsc = EthBsc()
  inst.network = network
  inst.ethBsc.init(network, provider)
  inst.latestFetchedBlock = inst.startingBlock
  inst.processDelay = processDelay
}

const EventListener = Record({
  event: undefined,
  network: undefined,
  processDelay: undefined,
  startingBlock: undefined,
  processLogs: null,
  onBlockHeader: null,
  onError: null,
  latestFetchedBlock: undefined,
  contractRepository: undefined,

  init,
  listen
})

module.exports = EventListener
