var express = require('express');
var session = require('express-session');
var cacheConfig = require('./db/cacheconfig')(session);
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var user = require('./model/user');
var everyauth = require('everyauth');
var fs = require('fs');
var credentials = JSON.parse(fs.readFileSync('./github.credentials.encrypted', 'UTF-8'));
everyauth.github
  .appId(credentials['appId'])
  .appSecret(credentials['appSecret'])
  .scope('user')
  .findOrCreateUser(function(session, accessToken, accessTokenSecret, githubUserData) {
    var promise = this.Promise();
    user.authenticateUser(accessToken, accessTokenSecret, githubUserData, promise);
    return promise;
  })
  .handleAuthCallbackError( function (req, res) {
    console.log('auth callback error');
  })
  .redirectPath('/');

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser('appfogv2'));
app.use(express.static(path.join(__dirname, 'public')));

//everyauth
app.use(session({
  store: cacheConfig.getRedisStore(),
  secret: 'appfogv2'
}));
app.use(everyauth.middleware());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//setup routes
app.use(app.router);

require('./routes')(app);

module.exports = app;
