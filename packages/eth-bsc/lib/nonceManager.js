const Record = require('@ppoliani/im-record')

const NonceManager = Record({
  web3: null,

  getNonce: inst => async account => {
    if(inst.nonce === undefined) {
      inst.nonce = await inst.web3.eth.getTransactionCount(account)
    }

    return inst.nonce
  },

  incNonce: inst => {
    inst.nonce += 1
  }
})

module.exports = NonceManager
