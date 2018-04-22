const express = require('express')
const bodyParser = require('body-parser')
const { join } = require('path')
require('./db')

const server = express()

server.use('/public/', express.static(join(__dirname, '../../public')))

server.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
  next()
})

server.use(bodyParser.urlencoded({
  extended: true
}))
server.use(bodyParser.json())

server.use('/', require('./router/root'))

server.get('*', (req, res) => {
  res.sendFile(join(__dirname, '../../public/index.html'))
})

server.listen(1080, (err) => {
  if (err) throw err
  console.log(`> Ready on http://localhost:1080`)
})
