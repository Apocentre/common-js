const NonceManager = require('./nonceManager')

let _nonceManager = null

const getNonceManager = web3 => {
  if(_nonceManager === null) {
    _nonceManager = NonceManager({web3})
  }

  return _nonceManager
}

const getGasPrice = async web3 => web3.eth.getGasPrice()

const signTx = inst => async (tx, privKey) => {
  return await inst.web3
    .eth
    .accounts
    .signTransaction(tx, privKey)
}

const craftTx = inst => async opts => {
  const {from, to, data, chainId, gasLimit} = opts
  const gasPrice = await getGasPrice(inst.web3)
  const nonceManager = getNonceManager(inst.web3)
  const nonce = await nonceManager.getNonce(from)

  return {
    nonce: Number(nonce),
    chainId,
    to,
    data,
    gasPrice,
    gas: gasLimit
  }
}

const sendTx = inst => signedTx => new Promise(resolve => {
  inst.web3
    .eth
    .sendSignedTransaction(signedTx.rawTransaction)
    .on('transactionHash', async txHash => {
      const nonceManager = getNonceManager(inst.web3)
      nonceManager.incNonce()

      resolve(txHash)
    })
})

module.exports = {
  craftTx,
  signTx,
  sendTx
}
