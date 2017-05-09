// built-in
const path = require('path')
const https = require('https')
const fs = require('fs')
//  crypto = require('crypto')

// npm modules
const express = require('express')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')

// Express.js app object
const app = express()
const config = require('./config.json').old

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')

// setup common facilities
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.get('/redirectims.html', (req, res) => {
  console.log("==> redirectims.html")
  console.log(JSON.stringify(req.url))
  console.log(JSON.stringify(req.query))
  console.log(JSON.stringify(req.headers))
  res.header("Content-type", "text/html")
  res.send(fs.readFileSync('public/redirectims_.html').toString().replace(/CLIENT_ID/, config.apiKey))
})


app.get('/', (_, res) => {
  res.render('index', {title: 'hello', clientId: config.apiKey})
})

app.get('/webhook', (req, res) => {
  res.send(req.query.challenge)
})

app.post('/webhook', (req, res) => {
  console.log("===> POST /")
  console.log(JSON.stringify(req.headers))
  console.log("------------------------------------------------------------")
  console.log(JSON.stringify(req.body))
  console.log("============================================================")
  res.send("ok")
})

module.exports = app
