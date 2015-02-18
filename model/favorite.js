var mysql = require('mysql');
var Q = require('q');
var dbconfig = require('../db/dbconfig');
var connection = mysql.createConnection(dbconfig.connectionInfo());
var favoriteTableDef = 'create or replace table favorites (' +
    'id INT NOT NULL AUTO_INCREMENT, ' +
    'user_id INT, ' +
    'whiskey_id INT, ' +
    'PRIMARY KEY (id), ' +
    'INDEX user_idx (user_id)' +
  ')';
console.log('creating favorites table:', favoriteTableDef);
connection.query(favoriteTableDef, function (queryError, result) {
  console.log('favorites table error:', JSON.stringify(queryError, undefined, 4));
  console.log('favorites table result:', JSON.stringify(result, undefined, 4));
});

exports.favoriteWhiskey = function(userId, whiskeyId) {
  var insertStatement = 'insert into favorites (user_id, whiskey_id) ' +
    'values (' + userId + ', ' + whiskeyId + ')';

  connection.query(insertStatement, function(queryError, result) {
    console.log('favorites insert error:', JSON.stringify(queryError, undefined, 4));
    console.log('favorites insert result:', JSON.stringify(result, undefined, 4));
  });
};

exports.findFavoritesByUser = function(userId) {
  var selectStatement = 'select * from favorites where user_id = ' + userId;
  var favoritesList = Q.defer();

  connection.query(selectStatement, function(queryError, result) {
    console.log('favorites query error:', JSON.stringify(queryError, undefined, 4));
    console.log('favorites query result:', JSON.stringify(result, undefined, 4));
    favoritesList.resolve(result);
  });

  return favoritesList.promise;
};
