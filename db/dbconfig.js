var mysql = require('mysql');
var connectionInfo = {
  user: 'drinker',
  password: 'flask',
  database: 'whizkey'
};

if (process.env.VCAP_SERVICES) {
  var services = JSON.parse(process.env.VCAP_SERVICES);
  var mysqlConfig = services["p-mysql"];
  if (mysqlConfig) {
    var node = mysqlConfig[0];
    connectionInfo = {
        host: node.credentials.hostname,
        port: node.credentials.port,
        user: node.credentials.username,
        password: node.credentials.password,
        database: node.credentials.name
    };
  }
}

exports.query = function(query, callback) {
  var connection = mysql.createConnection(connectionInfo);
  connection.query(query, function(queryError, result) {
    callback(queryError, result);
  });
  connection.end();
};
