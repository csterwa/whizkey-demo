var Q = require('q');
var dbconfig = require('../db/dbconfig');
var whiskeyTableDef = 'create or replace table whiskeys (' +
    'id INT NOT NULL AUTO_INCREMENT, ' +
    'name VARCHAR(100), ' +
    'description VARCHAR(900), ' +
    'PRIMARY KEY (id)' +
  ')';
console.log('creating whiskeys table:', whiskeyTableDef);
dbconfig.query(whiskeyTableDef, function (queryError, result) {
  console.log('whiskeys table error:', JSON.stringify(queryError, undefined, 4));
  console.log('whiskeys table result:', JSON.stringify(result, undefined, 4));
});

var addWhiskey = exports.addWhiskey = function(name, description) {
  var insertStatement = 'insert into whiskeys (name, description) ' +
    'values ("' + name + '", "' + description + '")';
  dbconfig.query(insertStatement, function(queryError, result) {
    console.log('add whiskey error:', JSON.stringify(queryError, undefined, 4));
    console.log('add whiskey result:', JSON.stringify(result, undefined, 4));
  });
};

exports.findAllWhiskeys = function() {
  var selectStatement = 'select * from whiskeys';
  var deferred = Q.defer();
  dbconfig.query(selectStatement, function(queryError, result) {
    deferred.resolve(result);
  });
  return deferred.promise;
}

var baseWhiskeyData = [
  {"name": "Aberlour 12", "description": "The 12 year-old expression is a fine example of how the distinctively crisp, citrus character of Aberlour’s raw spirit is deftly softened by double cask maturation. Traditional oak and seasoned Sherry butts are both used to great effect, as the mellowed spirits within are combined to deliver a subtly balanced flavour."},
  {"name": "Glenfiddich: The Original", "description": "Inspired by the pioneering spirit of Sandy Grant Gordon, this historic expression is a recreation of the original 1963 Glenfiddich Straight Malt that started the single malt category. Our Malt Master, Brian Kinsman, recreated the Original 1963 from our unrivalled collection of aged whiskies with the recipe uncovered from the Glenfiddich family archives. While most whiskies today mature in oak, sherry casks were more prominent in 1963. The result, then and now, is a spirit contrasting many of our other expressions. The aroma is floral with the hallmark Glenfiddich pear, followed by lively fruit notes, biscuity with a soft vanilla oakiness and deliciously dry finish."},
  {"name": "Johnnie Walker Blue Label", "description": "The pinnacle whisky of the House of Walker® – it is the epitome of blending. Created to reflect the style of whiskies in the early 19th century, it's created using some of our rarest casks from the Johnnie Walker stocks, the largest in the world. The casks are hand-selected and set aside for their exceptional quality, character and flavor. The character of Blue Label is truly unique; it is complex, powerful, incredibly smooth and retains the Johnnie Walker signature smokiness. King George V from Blue Label was created to celebrate the Royal Warrant given to the Walker family in 1934 to mark their exceptional quality. This blend includes Port Ellen™, a highly prized malt whose distillery no longer exists."}
];

for (var i = 0; i < baseWhiskeyData.length; i++) {
  var w = baseWhiskeyData[i];
  addWhiskey(w.name, w.description);
}
