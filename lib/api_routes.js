const express = require('express')
const Event = require('./event')
const {validateAccessToken, createWebhook} = require('./adobe_api')

const router = express.Router()

// The "real" authentication happens on the frontend, by going through the User
// Auth UI, and granting access
// (see https://creativesdk.adobe.com/docs/web/#/articles/userauthui/index.html)
// The result is an access token, which can be used to make API calls to Adobe.
// You'll need this access token to install a webhook for the user.
// The frontend sends this access token to the server with this '/authenticate'
// endpoint, which does an API call to check that the token is valid, and to
// retrieve the Adobe ID associated with the user, which is then stored in the
// session.
router.post('/authenticate', (req, res) => {
  req.on('data', (data) => {
    let accessToken = data.toString()
    validateAccessToken(accessToken)
      .then((auth) => {
        // create a new session id before elevating privileges,
        // this prevents session fixation attacks
        req.session.regenerate(() => {
          let adobeId = auth.token.user_id
          console.log('Authenticated', adobeId)
          req.session.accessToken = accessToken
          req.session.adobeId = adobeId
          res.send('OK')
        })
      })
      .catch((err) => {
        console.log('Authentication failed', err)
        res.status(403)
        res.send(JSON.stringify(err))
      })
  })
})

router.post('/create_webhook', (req, res) => {
  if (req.session.accessToken && req.session.adobeId) {
    createWebhook(req.session.accessToken)
      .then((webhookData) => {
        if (webhookData.status === 'VERIFIED') {
          console.log('Created webhook', JSON.stringify(webhookData))

          Event.create({
            userId: req.session.adobeId,
            type: 'create_webhook',
            message: 'Started tracking events',
            rawEvent: JSON.stringify(webhookData),
            createdAt: new Date()
          })

          res.send(JSON.stringify(webhookData))
        } else {
          console.log('Creating webhook failed', webhookData)
          res.status(400)
          res.send(JSON.stringify(webhookData))
        }
      })
      .catch((err) => {
        console.log('Creating webhook failed', err)
        res.status(400)
        res.send(JSON.stringify(err))
      })
  } else {
    console.log('Creating webhook failed, user not authenticated')
    res.status(400)
    res.send('User must be authenticated to create a webhook')
  }
})

module.exports = router
