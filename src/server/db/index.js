const mongoose = require('mongoose')
const config = require('../../../config')

mongoose.connect(`mongodb://${config.DB.USER}:${config.DB.PASSWORD}@${config.DB.SERVER}:${config.DB.PORT}/${config.DB.INSTANCE}`)
const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error:'))
db.once('open', () => {
  console.info('db connected')
})

module.exports = db
