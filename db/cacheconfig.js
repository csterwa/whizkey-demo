module.exports = function(session) {
  var RedisStore = require('connect-redis')(session);
  var options = {};

  if (process.env.VCAP_SERVICES) {
    var services = JSON.parse(process.env.VCAP_SERVICES);
    var redisConfig = services["p-redis"];
    if (redisConfig) {
      var node = redisConfig[0];
      options = {
          host: node.credentials.host,
          port: node.credentials.port,
          pass: node.credentials.password,
      };
    }
  }

  return {
    getRedisStore: function() {
      return new RedisStore(options);
    }
  };
}
