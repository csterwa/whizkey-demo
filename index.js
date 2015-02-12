var http = require('http');
var mysql = require('mysql');
var serveStatic = require('serve-static');
var finalhandler = require('finalhandler');
var port = process.env.VCAP_APP_PORT || 9050;
var vcap_app = process.env.VCAP_APPLICATION || '{"instance_index": 0}';
var app_vars = JSON.parse(vcap_app);
var instance_id = app_vars["instance_index"];

var serve = serveStatic('pages', {'index': ['index.html']})

// Create server
var server = http.createServer(function(req, res){
  var done = finalhandler(req, res)
  serve(req, res, done)
})

// Listen
server.listen(port)

console.log('Server started on [' + port + ']');
