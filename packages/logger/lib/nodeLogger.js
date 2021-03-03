const homedir = require('os').homedir();
const {createLogger, transports, format} = require('winston')
const {Loggly} = require('winston-loggly-bulk')

const {combine, timestamp, printf} = format;

const customFormat = printf(({level, message, timestamp}) => {
  return `${timestamp} [${level}]: ${message}`;
})

const logger = createLogger({
  format: combine(
    timestamp(),
    customFormat
  ),
  level: 'info',
  transports: [
    new transports.File({filename: `${homedir}/logs/hot-cross/error.log`, level: 'error'}),
    new transports.File({filename: `${homedir}/logs/hot-cross/info.log`, level: 'info'}),
  ]
})

if(process.env.NODE_ENV === 'production') {
  logger.add(new Loggly({
    token: process.env.LOGGLY_TOKEN,
    subdomain: process.env.LOGGLY_SUBDOMAIN,
    tags: ['validator'],
    json: true
  }))
}

if(process.env.NODE_ENV !== 'production') {
  logger.add(new transports.Console({
    format: format.simple()
  }))
}

module.exports = {
  info: msg => logger.info(msg),
  warn: msg => logger.warn(msg),
  error: msg => logger.error(msg)
}

