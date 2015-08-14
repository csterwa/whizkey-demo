var mysql = require('mysql');
var connectionInfo = {
  user: 'drinker',
  password: 'flask',
  database: 'whizkey'
};

if (process.env.VCAP_SERVICES) {
  var services = JSON.parse(process.env.VCAP_SERVICES);
  var ctlMysqlConfig = services["ctl_mysql"];
  var pMysqlConfig = services["p-mysql"];

  if (ctlMysqlConfig) {
    var node = ctlMysqlConfig[0];
    connectionInfo = {
        host: node.credentials.host,
        port: node.credentials.port,
        user: node.credentials.username,
        password: node.credentials.password,
        database: node.credentials.dbname,
        ssl: {
          ca: node.credentials.certificate
        }
    };
  } else if (pMysqlConfig) {
    var node = pMysqlConfig[0];
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
