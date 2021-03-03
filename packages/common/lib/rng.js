const random = require('random')
const seedrandom = require('seedrandom')

const getRandomNum = (seed, range) => {
  random.use(seedrandom(seed))
  const rng = random.uniform(0, range)

  return rng()
}

module.exports = {
  getRandomNum
}
