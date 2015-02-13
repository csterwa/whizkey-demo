exports.authenticateUser = function(accessToken, accessTokenSecret, githubUserData, promise) {
  var authData = {
    accessToken: accessToken,
    accessTokenSecret: accessTokenSecret,
    username: githubUserData.login,
    githubId: githubUserData.id
  };
  return promise.fulfill(authData);
};
