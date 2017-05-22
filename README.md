## Assetlog

Keep a log of changes happening on your Adobe Creative Cloud Assets storage.

Sample application for using webhooks.

### Creating an integration

Your first step is to create a new integration in the [Adobe I/O Console](https://console.adobe.io/integrations).

- Step 1, "Access an API"
- Step 2, "Creative SDK"
- Step 3, "New Integration"
- Step 4, Choose a name, description, and configure the callback url (you need to know your hostname for this, see below for instructions using either Ngrok or Heroku)

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
