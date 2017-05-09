// built-in
const path = require('path')

// npm modules
const express = require('express')
const logger = require('morgan')
// const bodyParser = require('body-parser')
const session = require('express-session')

// Express.js app object
const app = express()

// Configure view engine
app.set('views', path.join(__dirname, '../views'))
app.set('view engine', 'pug')

// Configure middleware
app.use(logger('dev'))
app.use(session({secret: process.env.SECRET_SESSION_KEY}))
app.use(express.static(path.join(__dirname, '../public')))

// Mount routes
app.use('/', require('./main_routes'))
app.use('/', require('./api_routes'))
app.use('/webhook', require('./webhook_routes'))

module.exports = app

// app.use(bodyParser.json())
// app.use(bodyParser.urlencoded({ extended: false }))
