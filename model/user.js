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

var connection = mysql.createConnection(connectionInfo);
var userTableDef = 'create or replace table users (' +
    'githubId int, ' +
    'githubUsername VARCHAR(100), ' +
    'avatarUrl VARCHAR(100), ' +
    'PRIMARY KEY(githubId)' +
  ')';
console.log('creating users table:', userTableDef);
connection.query(userTableDef, function (queryError, result) {
  console.log('user table error:', JSON.stringify(queryError, undefined, 4));
  console.log('user table result:', JSON.stringify(result, undefined, 4));
});

exports.authenticateUser = function(accessToken, accessTokenSecret, githubUserData, promise) {
  var userLookupQuery = 'select * from users where githubId = ' + githubUserData.id;
  connection.query(userLookupQuery, function(err, result) {
    if (result.length === 0) {
      var userCreateStatement = 'insert into users (githubId, githubUsername, avatarUrl) ' +
        'values (' + githubUserData.id + ', "' + githubUserData.login + '", "' + githubUserData.avatar_url + '")';

      console.log('create user:', userCreateStatement);
      connection.query(userCreateStatement, function(createErr, createResult) {
        if (createErr) {
          promise.fail('Unable to create user for ' + githubUserData.login + ': ' + createErr);
          console.log('unable to create user:', githubUserData.login + ': ' + createErr);
          return promise;
        }

        var authData = {
          accessToken: accessToken,
          accessTokenSecret: accessTokenSecret,
          githubUsername: githubUserData.login,
          githubId: githubUserData.id,
          avatarUrl: githubUserData.avatar_url
        };

        console.log('created user:', authData);
        promise.fulfill(authData);
      });
    } else {
      console.log('existing user:', result[0]);
      promise.fulfill(result[0]);
    }
  });

  return promise;
};
