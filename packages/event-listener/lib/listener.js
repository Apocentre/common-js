const Record = require('@ppoliani/im-record')
const logger = require('@apocentre/logger')
const {EthBsc} = require('@apocentre/eth-bsc')

const getStartingBlock = async inst => {
  const startingBlock =  Number(
    !inst.latestFetchedBlock
      ? await inst.contractRepository.getContractBlockNumber(inst)
      : inst.latestFetchedBlock
  )

  return Number(startingBlock)
}

const loadEvents = inst => async (startingBlock, latestBlock) => {
  try {
    if(startingBlock === undefined) {
      startingBlock = await getStartingBlock(inst)
    }

    logger.info(`Load events for blocks ${[startingBlock, latestBlock]} on ${inst.network}`)

    const logs = await inst.ethBsc.getPastLogs(
      inst.contractRepository.getContract(inst),
      inst.event, 
      startingBlock,
      latestBlock
    )

    logger.info(`${logs.length} events fetched from ${inst.network}`)

    await inst.processLogs(logs, startingBlock)

    // We're updating the local value, however nothing guarantees that the process logs will be successful.
    // That's responsibility of the caller which would need to restart the listener passing the correct startingBlock
    // if an error occurs
    inst.latestFetchedBlock = Math.max(latestBlock + 1, inst.latestFetchedBlock || 0)
  }
  catch(error) {
    inst.onError({
      message: error.message,
      data: {startingBlock, latestBlock}
    })
  }
}

const listen = inst => {
  const onData = async (data) => {
    inst.onBlockHeader(data)
    await loadEvents(inst)(await getStartingBlock(inst), data.number)
  }

  return inst.ethBsc.subscribeToBlockHeader(
    onData, 
    inst.onError
  )
}

const init = inst => (
  network,
  provider,
  blockTime,
  blockFinality
) => {
  inst.ethBsc = EthBsc()
  inst.ethBsc.init(network, provider, blockTime, blockFinality)
  inst.network = network
  inst.latestFetchedBlock = inst.startingBlock
}

const noop = _ => () => {}

const EventListener = Record({
  event: undefined,
  network: undefined,
  startingBlock: undefined,
  processLogs: null,
  onError: null,
  latestFetchedBlock: undefined,
  contractRepository: undefined,

  onBlockHeader: noop,
  init,
  listen,
  loadEvents
})

module.exports = EventListener
