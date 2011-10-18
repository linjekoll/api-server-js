var tube       = "linjekoll.socket-server";
var beanstalk  = require('nodestalker/lib/beanstalk_client');
var client     = beanstalk.Client();

/*
  @data String Pushes @data to beanstalkd @tube
*/
exports.push = function(data) {
  client.use(tube).onSuccess(function() {
    client.put(data);
  });
};