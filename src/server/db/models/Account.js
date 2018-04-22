const mongoose = require('mongoose')
const Schema = mongoose.Schema

const accountSchema = new Schema({
  name: String,
  email: String,
  licenseKey: String,
  pcKey: [{ key: String, date: { type: Date, default: Date.now } }],
  date: { type: Date, default: Date.now }
})

module.exports = mongoose.model('Account', accountSchema)
