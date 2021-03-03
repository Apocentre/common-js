const sign = inst => async (msg, privKey) => {
  return await inst.web3
    .eth
    .accounts
    .sign(msg, privKey)
}

const signMsg = inst => async (msg, account) => {
  return inst.web3
    .eth
    .personal
    .sign(msg, account)
}

const equals = (accountA, accountB) => accountA.toLowerCase() === accountB.toLowerCase()

module.exports = {
  sign,
  signMsg,
  equals
}
