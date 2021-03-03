const {calculateCreate2} = require('eth-create2-calculator')

const Contract = inst => (...args) => {
  return new inst.web3.eth.Contract(...args)
}

module.exports = {Contract, calculateCreate2}
