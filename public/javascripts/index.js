/* globals AdobeCreativeSDK: false, $: false, ADOBE_API_KEY: false */

// Initalize the Creative SDK
AdobeCreativeSDK.init({
  clientID: ADOBE_API_KEY,
  onError: function (error) {
    if (error.type === AdobeCreativeSDK.ErrorTypes.AUTHENTICATION) {
      console.log('You must be logged in to use the Creative SDK')
    } else if (error.type === AdobeCreativeSDK.ErrorTypes.GLOBAL_CONFIGURATION) {
      console.log('Please check your configuration')
    } else if (error.type === AdobeCreativeSDK.ErrorTypes.SERVER_ERROR) {
      console.log('Oops, something went wrong')
    }
  }
})

// If the user has already granted the app access, and is currently logged in,
// then we get an access token back that can be used to do API calls and install
// webhooks.
//
// If that's the case then send that token to the server to be validated and
// stored in the session, and then redirect to the events page.
function handleAuthorized (csdkAuth) {
  $.post('/authenticate', csdkAuth.accessToken, function () {
    window.location.pathname = '/events'
  }).fail(function () {
    console.log('Failed to validate access token.')
  })
}

// Check the user's authorization status. If they aren't logged in then pop up a
// log in screen. After logging in and granting authorizing to the app, the
// login window closes, and we check the user's authorization status again.
function handleCsdkLogin () {
  AdobeCreativeSDK.getAuthStatus(function (csdkAuth) {
    if (csdkAuth.isAuthorized) {
      handleAuthorized(csdkAuth)
    } else {
      AdobeCreativeSDK.login(handleCsdkLogin)
    }
  })
}

// Attach a handler to the login button that checks the authorization status and
// either redirects to the events page, or pops up a login window.
$('#csdk-login').on('click', handleCsdkLogin)

// Do a first check on page load, since the user might already be logged in.
AdobeCreativeSDK.getAuthStatus(function (csdkAuth) {
  if (csdkAuth.isAuthorized) {
    handleAuthorized(csdkAuth)
  } else {
    $('#spinner').hide()
    $('#csdk-login').show()
  }
})
