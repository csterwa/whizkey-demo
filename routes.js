var whiskey = require('./model/whiskey');

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
  })

  function renderFind(req, res) {
    var whiskeyListPromise = whiskey.findAllWhiskeys();

    whiskeyListPromise.then(function(whiskeyList) {
      res.render('find', { title: "Whizkey: Find a Whiskey", instanceId: instance_id, req: req, whiskeyList: whiskeyList });
    });
  };

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
