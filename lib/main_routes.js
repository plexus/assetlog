const express = require('express')
const Event = require('./event')

const ADOBE_API_KEY = process.env.ADOBE_API_KEY

const router = express.Router()

router.get('/', (_, res) => {
  res.render('index', {title: 'hello', clientId: ADOBE_API_KEY})
})

router.get('/redirectims.html', (req, res) => {
  res.render('redirect_ims', {clientId: ADOBE_API_KEY})
})

router.get('/events', (req, res) => {
  Event.findAll({
    where: {
      userId: req.session.adobeId
    }
  }).then((events) => {
    res.render('events', {events})
  })
})

module.exports = router
