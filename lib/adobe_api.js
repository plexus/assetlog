const https = require('https')

const APPLICATION_ID = process.env.ADOBE_APPLICATION_ID
const CONSUMER_ID = process.env.ADOBE_CONSUMER_ID
const API_KEY = process.env.ADOBE_API_KEY
// const API_SECRET = process.env.ADOBE_API_SECRET
const HOSTNAME = process.env.HOSTNAME

function performRequest (options, postData) {
  return new Promise((resolve, reject) => {
    let req = https.request(options, (res) => {
      if (res.statusCode === 200) {
        let result = ''
        res.setEncoding('utf8')
        res.on('data', (d) => { result += d })
        res.on('end', () => resolve(JSON.parse(result)))
      } else {
        reject(res)
      }
    })

    req.on('error', reject)

    if (postData) {
      req.write(postData)
    }

    req.end()
  })
}

function validateAccessToken (accessToken) {
  return performRequest({
    method: 'POST',
    host: 'ims-na1.adobelogin.com',
    path: `/ims/validate_token/v1?token=${accessToken}&client_id=${API_KEY}`
  })
}

function createWebhook (accessToken) {
  return performRequest({
    method: 'POST',
    host: 'csm.adobe.io',
    path: '/csm/webhooks',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-type': 'application/json',
      'x-ams-application-id': APPLICATION_ID,
      'x-ams-consumer-id': CONSUMER_ID,
      'x-api-key': API_KEY
    }
  }, JSON.stringify({
    'client_id': API_KEY,
    'name': 'Assetlog Webhook',
    'description': 'Log events to assets',
    'webhook_url': `https://${HOSTNAME}/webhook`,
    'events_of_interest': [
      {'provider': 'ccstorage', 'event_code': 'asset_created'},
      {'provider': 'ccstorage', 'event_code': 'asset_updated'},
      {'provider': 'ccstorage', 'event_code': 'asset_deleted'}
    ]
  }))
}

// POST https://csm.adobe.io/csm/webhooks
// Authorization: Bearer :access_token
// Content-type: application/json
// x-ams-application-id: :application_id
// x-ams-consumer-id: :consumer_id
// x-api-key: :api_key
//
// {"client_id": ":api_key",
//  "name": ":webhook_name",
//  "description": ":webhook_desc",
//  "webhook_url": ":webhook_url",
//  "events_of_interest": [
//    {"provider": "ccstorage", "event_code": "asset_created"},
//    {"provider": "ccstorage", "event_code": "asset_updated"},
//    {"provider": "ccstorage", "event_code": "asset_deleted"}]}

module.exports = {validateAccessToken, createWebhook}
