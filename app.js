var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var user = require('./model/user');
var whiskey = require('./model/whiskey');
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
app.use(express.session({secret: 'appfogv2'}));
app.use(everyauth.middleware());
everyauth.helpExpress(app);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//setup routes
app.use(app.router);
// var mainRoutes = require('./routes/index');
// app.use('/', mainRoutes);
var vcap_app = process.env.VCAP_APPLICATION || '{"instance_index": 0}';
var app_vars = JSON.parse(vcap_app);
var instance_id = app_vars["instance_index"];

/* GET home page. */
app.get('/', function(req, res) {
  res.render('index', { title: 'Whizkey', instanceId: instance_id, req: req });
});

/* GET find page. */
app.get('/find', function(req, res) {
  var whiskeyListPromise = whiskey.findAllWhiskeys();

  whiskeyListPromise.then(function(whiskeyList) {
    console.log('whiskey list:', whiskeyList);
    res.render('find', { title: "Whizkey: Find a Whiskey", instanceId: instance_id, req: req, whiskeyList: whiskeyList });
  });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

module.exports = app;
