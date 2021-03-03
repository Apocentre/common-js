const Networks = {
  ETHEREUM: 'Ethereum',
  BSC: 'Binance Smart Chain',

  fromChainId(network) {
    switch(network) {
      case Number(process['env']['ETH_CHAIN_ID']):
        return this.ETHEREUM
      case Number(process['env']['BSC_CHAIN_ID']):
        return this.BSC
    }
  }
}

module.exports = {Networks}
