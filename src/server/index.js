const express = require('express')
const bodyParser = require('body-parser')
const { join } = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

require('./db')

const server = express()

server.use('/public/', express.static(join(__dirname, '../../public')))

server.use(bodyParser.urlencoded({
  extended: true
}))
server.use(bodyParser.json())

server.use(session({
  secret: 'SuperLicenseKey',
  store: new MongoStore({ mongooseConnection: require('./db') }),
  resave: false,
  saveUninitialized: true
}))

server.use('/', require('./router/root'))

server.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../../public/index.html'))
})

server.listen(1080, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:1080`)
})
