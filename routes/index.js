var express = require('express');
var router = express.Router();

var vcap_app = process.env.VCAP_APPLICATION || '{"instance_index": 0}';
var app_vars = JSON.parse(vcap_app);
var instance_id = app_vars["instance_index"];


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Whizkey', instanceId: instance_id });
});

module.exports = router;
