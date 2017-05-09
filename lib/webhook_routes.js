const express = require('express')
const crypto = require('crypto')
const bodyParser = require('body-parser')

const Event = require('./event')

const ADOBE_API_SECRET = process.env.ADOBE_API_SECRET
const router = express.Router()

router.use('/', bodyParser.json({
  verify: function (req, res, buf, encoding) {
    const hmac = crypto.createHmac('sha256', ADOBE_API_SECRET)
    hmac.update(buf.toString())

    if (req.header('x-adobe-signature') !== hmac.digest('base64')) {
      throw new Error('X-Adobe-Signature HMAC check failed')
    }
  }
}))

// When installing a new webhook, this challenge request will be done to verify
// that we are in control of this domain. If the challenge fails then the call
// to create the webhook will return with a VERIFICATION_FAILED status
router.get('/', (req, res) => {
  res.send(req.query.challenge)
})

function eventMessage (data) {
  switch (data.asset.type) {
    case 'asset_created':
      return `Created asset ${data.asset.filename} in ${data.asset.pathname}`
    case 'asset_updated':
      return `Updated asset ${data.asset.filename} in ${data.asset.pathname}`
    case 'asset_deleted':
      return `Deleted asset ${data.asset.filename} in ${data.asset.pathname}`
  }
}

router.post('/', (req, res) => {
  console.log('Received webhook', JSON.stringify(req.body))

  let data = req.body

  Event.create({
    userId: data.asset.user_id,
    type: data.asset.type,
    message: eventMessage(data),
    rawEvent: JSON.stringify(data),
    createdAt: data.created_at
  })

  res.send('ok')
})

module.exports = router

// Sample webhook data:
//
// {"id":"f9218f73-feaa-425f-866d-4940b77fb7d4",
//  "category":"asset",
//  "source":"creative-cloud",
//  "asset":{
//    "type":"asset_created",
//    "url":"https://cc-api-storage.adobe.io/id/urn:aaid:sc:eu:f7f4c7b9-9216-4f23-a41e-185cc2e1e2b3",
//    "filename":"cat.png",
//    "pathname":"/files/cat.png",
//    "asset_id":"urn:aaid:sc:eu:f7f4c7b9-9216-4f23-a41e-185cc2e1e2b3",
//    "user_id":"3CEFA11A5901B53B0A495CC2@AdobeID",
//    "mime_type":"image/png"
//  },
//  "created_at":"2017-05-08T17:34:59.683Z"}
