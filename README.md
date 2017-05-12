## Assetlog

Keep a log of changes happening on your Adobe Creative Cloud Assets storage.

Sample application for using webhooks.

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
