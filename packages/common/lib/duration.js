const duration = {
  milliseconds(val) {
    return val
  },
  seconds(val) {
    return val * this.milliseconds(1000)
  },
  minutes(val) {
    return val * this.seconds(60)
  },
  hours(val) {
    return val * this.minutes(60)
  },
  days(val) {
    return val * this.hours(24)
  },
  weeks(val) {
    return val * this.days(7)
  },
  months(val) {
    return val * this.days(30)
  },
  years(val) {
    return val * this.days(365)
  }
}

module.exports = duration
