var whiskey = require('./model/whiskey');
var favorites = require('./model/favorite');
var everyauth = require('everyauth');
var _ = require('underscore');

module.exports = function(app) {
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
    renderFind(req, res);
  });

  /* GET add page. */
  app.get('/add', function(req, res) {
    res.render('add', { title: "Whizkey: Add a Whiskey", instanceId: instance_id, req: req });
  });

  /* POST whiskey data */
  app.post('/whiskey', function(req, res) {
    whiskey.addWhiskey(req.body.name, req.body.description);

    renderFind(req, res);
  });

  function renderFind(req, res) {
    var whiskeyListPromise = whiskey.findAllWhiskeys();

    if (req.session.auth) {
      var favoriteWhiskeyListPromise = favorites.findFavoritesByUser(req.session.auth.github.user.id);

      favoriteWhiskeyListPromise.then(function(favoritesList) {
        whiskeyListPromise.then(function(whiskeyList) {
          for (var i = 0; i < whiskeyList.length; i++) {
            whiskeyList[i].favorite = _.contains(_.pluck(favoritesList, 'whiskey_id'), whiskeyList[i].id);
          }
          res.render('find', { title: "Whizkey: Find a Whiskey", instanceId: instance_id, req: req, whiskeyList: whiskeyList, favorites: favoritesList});
        });
      });
    } else {
      renderHome(req, res);
    }
  };

  function renderHome(req, res) {
    res.render('index', { title: 'Whizkey', instanceId: instance_id, req: req });
  };

  app.post('/favorite', function(req, res) {
    favorites.favoriteWhiskey(req.session.auth.github.user.id, req.body['whiskey-id']);
    renderFind(req, res);
  });

  app.get('/myfavorites', function(req, res) {
    var whiskeyListPromise = whiskey.findAllWhiskeys();

    if (req.session.auth) {
      var favoriteWhiskeyListPromise = favorites.findFavoritesByUser(req.session.auth.github.user.id);

      favoriteWhiskeyListPromise.then(function(favoritesList) {
        whiskeyListPromise.then(function(whiskeyList) {
          var favoriteWhiskeyList = [];
          for (var i = 0; i < whiskeyList.length; i++) {
            if (_.contains(_.pluck(favoritesList, 'whiskey_id'), whiskeyList[i].id)) {
              favoriteWhiskeyList.push(whiskeyList[i]);
            }
          }
          res.render('myfavorites', { title: "Whizkey: My Favorites", instanceId: instance_id, req: req, favorites: favoriteWhiskeyList});
        });
      });
    } else {
      renderHome(req, res);
    }
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
};
