/* globals $: false */

// // Initalize the Creative SDK
// AdobeCreativeSDK.init({
//   clientID: ADOBE_API_KEY,
//   onError: function (error) {
//     if (error.type === AdobeCreativeSDK.ErrorTypes.AUTHENTICATION) {
//       console.log('You must be logged in to use the Creative SDK')
//     } else if (error.type === AdobeCreativeSDK.ErrorTypes.GLOBAL_CONFIGURATION) {
//       console.log('Please check your configuration')
//     } else if (error.type === AdobeCreativeSDK.ErrorTypes.SERVER_ERROR) {
//       console.log('Oops, something went wrong')
//     }
//   }
// })

function createWebhook () {
  $.post('/create_webhook', function () {
    window.location.reload()
  }).fail(function () {
    console.log('Failed to create webhook.')
  })
}

// Attach a handler to the login button that checks the authorization status and
// either redirects to the events page, or pops up a login window.
var createWebhookButton = document.getElementById('createWebhookButton')
createWebhookButton.addEventListener('click', createWebhook, false)
