var tube       = "linjekoll.socket-server";
var beanstalk  = require('nodestalker/lib/beanstalk_client');
var client     = beanstalk.Client();

/*
  @data String Pushes @data to beanstalkd @tube
*/
exports.push = function(data) {
  console.log("Using " + tube + " as tube.");
  client.use(tube).onSuccess(function() {
    console.log("Pushing data: " + data);
    client.put(data);
  });
};