var dbconfig = require('../db/dbconfig');
var userTableDef = 'create table if not exists users (' +
    'github_id int, ' +
    'github_username VARCHAR(100), ' +
    'avatar_url VARCHAR(100), ' +
    'PRIMARY KEY(github_id)' +
  ')';
console.log('creating users table:', userTableDef);
dbconfig.query(userTableDef, function (queryError, result) {
  console.log('user table error:', JSON.stringify(queryError, undefined, 4));
  console.log('user table result:', JSON.stringify(result, undefined, 4));
});

exports.authenticateUser = function(accessToken, accessTokenSecret, githubUserData, promise) {
  var userLookupQuery = 'select * from users where github_id = ' + githubUserData.id;
  dbconfig.query(userLookupQuery, function(err, result) {
    if (result.length === 0) {
      var userCreateStatement = 'insert into users (github_id, github_username, avatar_url) ' +
        'values (' + githubUserData.id + ', "' + githubUserData.login + '", "' + githubUserData.avatar_url + '")';

      console.log('create user:', userCreateStatement);
      dbconfig.query(userCreateStatement, function(createErr, createResult) {
        if (createErr) {
          promise.fail('Unable to create user for ' + githubUserData.login + ': ' + createErr);
          console.log('unable to create user:', githubUserData.login + ': ' + createErr);
          return promise;
        }

        var authData = {
          accessToken: accessToken,
          accessTokenSecret: accessTokenSecret,
          github_username: githubUserData.login,
          github_id: githubUserData.id,
          avatar_url: githubUserData.avatar_url
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
