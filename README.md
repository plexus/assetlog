# Assetlog

Keep a log of changes happening on your Adobe Creative Cloud Assets storage.

Sample application for using Adobe Events webhooks.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Introduction](#introduction)
- [Prerequisites](#prerequisites)
- [Setting up the application locally](#setting-up-the-application-locally)
  - [Start ngrok](#start-ngrok)
  - [Create the integration](#create-the-integration)
  - [Running the app](#running-the-app)
  - [Heroku](#heroku)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Introduction

This is a sample application written in Node.js using the Express web framework. It demonstrates how to use the [Adobe Creative SDK](https://creativesdk.adobe.com/) to [perform authentication](https://creativesdk.adobe.com/docs/web/#/articles/userauthui/index.html), how to programmatically register webhooks to receive events from [Adobe Creative Cloud Assets](https://assets.adobe.com), and how to verify and handle these incoming webhook events.

You can try it out at [https://assetlog.herokuapp.com](https://assetlog.herokuapp.com).

## Prerequisites

You need an Adobe ID, and access to the Adobe I/O Events Beta program ([request form](https://adobeio.typeform.com/to/QvEgPP)).

You need to [Node.js](http://nodejs.org/) installed, version 6.0.0 or later, and [npm](http://npmjs.com/).

To be able to use the Adobe Creative SDK for authentication, and to be able to receive inbound webhook calls, your application needs to be accessible from the open internet (have a public domain name), and use SSL encryption (HTTPS). An easy way to make your local development machine publicly accesible over HTTPS is with [Ngrok](http://ngrok.io/).

Alternatively you can run the app on a hosting service that takes care of these aspects. This document describes how to deploy the app to [Heroku](http://heroku.com/).

## Setting up the application locally

### Start ngrok

Ngrok is a tool that creates a public domain name, and then forwards all HTTP and HTTPS traffic from that domain to a port on your local machine. That way you can run a web application locally, but make it accessible to the outside word.

Do this step first, because you will need to know your public domain name for the next step. Avoid restarting ngrok, because each time you do it will assign you a different domain name, so use a separate terminal window where you can leave ngrok running in the background.

```
ngrok http 3000
```

Make a note of the address you have been assigned. You will need this in the next step, for instance:

```
Forwarding     http://393732bc.ngrok.io -> localhost:3000
Forwarding     https://393732bc.ngrok.io -> localhost:3000
```

### Create the integration

Open the [Adobe I/O Console Integrations Page](https://console.adobe.io/integrations), and click on "New Integration"

![](img/new_integration_step_1.png)

Choose "Access an API", and click on "Continue"

![](img/new_integration_step_2.png)

Choose "Creative SDK", click "Continue"

![](img/new_integration_step_3.png)

Choose "New Integration", click "Continue"

![](img/new_integration_step_4.png)

Give your application a name and description. For the callback url, fill in the HTTPS url you got from Ngrok. For the URI pattern, use the same value, but escape the periods in the domain name wit a slash, and add `.*` at the end. This is a regular expression, it must match `https://yourdomain.com/redirectims.html` for the application to work correctly.

![](img/new_integration_step_5.png)

You application has been created, click "Continue to Integration Details"

----

Once your integration is created, go into "Events", and add the "Creative Cloud Assets" event provider.

### Running the app

To run the app, copy `.env.sample` to `.env`, and fill in the blanks. You'll find comments in that file that explain which values you need.

Make sure you have a reasonably up to date Node.js, since the app uses ES6 syntax.

Install the necessary dependencies

```
npm install
```

Run the migrations, so the database tables are created

```
npm run migrate
```

And run the app

```
npm start
```

This will start the app on port 5000 (or whatever value is set for `PORT` in `.env`), so you can browse to it at [http://localhost:5000](http://localhost:5000). Note that for the Adobe Auth UI to work correctly you need to be running on https (so with SSL encryption), and to actually receive webhooks the app needs to be accessible from the open internet. You can achieve both easily with [Ngrok](https://ngrok.com/).

```
ngrok http 5000
```

This command will set up a public domain, and forward all traffic that it receives to your app running locally. Look for these lines in the output to find the domain name.

```
Forwarding                    http://393532bc.ngrok.io -> localhost:3000
Forwarding                    https://393532bc.ngrok.io -> localhost:3000
```

You need to configure this as the `HOSTNAME` in `.env`. The app needs to know its own location, so that it can correctly register webhooks.

```
HOSTNAME=393532bc.ngrok.io
```

You also need this domain name to configure your [integration's Redirect URI](https://console.adobe.io/integrations). This is necessary for authentication to work.

* Redirect URI: `https://393532bc.ngrok.io`
* Redirect URI pattern: `https://393532bc\\.ngrok\\.io/.*`

The redirect URI pattern is a regular expression, which has to match at least `https://yourdomain/redirectims.html`. If you find you're not being redirected back properly after authentication, then make sure this pattern is correct or set Redirect URI to `https://yourdomain/redirectims.html`.

### Heroku

Deploying to heroku

- Create a new Heroku application. This also adds a `heroku` remote to your git config so you can push code to it.

```
heroku create
```

- Add postgres, so there's a database. This will also set the `DATABASE_URL` environment variable to the right value.

```
heroku addons:create heroku-postgresql:hobby-dev
```

- Deploy the application code to Heroku

```
git push heroku master
```

- Run the migrations, this creates the necessary database tables

```
heroku run npm run migrate
```

- Now you need to set the necessary environment variables, these are the ones that are listed in the `.env` file. You can do this either one by one, e.g.

```
heroku config:set ADOBE_APPLICATION_ID=123
```

Or you can copy over the values from your `.env` file with this plugin

```
heroku plugins:install heroku-config
heroku config:push
```

This will *not* override any environment variables provided by Heroku like `DATABASE_URL`, so you don't end up accidentally changing those.

Verify that they're all there with `heroku config`. Make sure `HOSTNAME` is the domain name of your heroku app.

- Now your app should be up and running. `heroku open` will open it in the browser, with `heroku logs -t` you can follow the server logs.
