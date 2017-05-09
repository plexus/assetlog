var csdkLoginBtn = document.getElementById("csdk-login");
csdkLoginBtn.addEventListener('click', handleCsdkLogin, false);

var access_token = "";

AdobeCreativeSDK.init({
    clientID: CONFIG.CSDK_CLIENT_ID,
    onError: function(error) {
        if (error.type === AdobeCreativeSDK.ErrorTypes.AUTHENTICATION) {
            /*
            	Note: this error will occur when you try
                to launch a component without checking if
            	the user has authorized your app.

            	From here, you can trigger
                AdobeCreativeSDK.loginWithRedirect().
            */
            console.log('You must be logged in to use the Creative SDK');
        } else if (error.type === AdobeCreativeSDK.ErrorTypes.GLOBAL_CONFIGURATION) {
            console.log('Please check your configuration');
        } else if (error.type === AdobeCreativeSDK.ErrorTypes.SERVER_ERROR) {
            console.log('Oops, something went wrong');
        }
    }
});


function handleCsdkLogin() {
  AdobeCreativeSDK.getAuthStatus(function(csdkAuth) {
        if (csdkAuth.isAuthorized) {
            access_token = csdkAuth.accessToken;
            csdkLoginBtn.disabled = true;
            csdkLoginBtn.value = "Authorized";
        } else {
            AdobeCreativeSDK.login(handleCsdkLogin);
        }
    });
}
