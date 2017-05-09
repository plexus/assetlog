## Assetlog

Keep a log of changes happening on your Adobe Creative Cloud Assets storage.

Sample application for using webhooks.


### Heroku

```
heroku create
heroku addons:create heroku-postgresql:hobby-dev
git push heroku master
heroku run npm run migrate
heroku plugins:install heroku-config
heroku config:push
```
