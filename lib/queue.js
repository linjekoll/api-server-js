var tube       = "lineart.update";
var beanstalk  = require('nodestalker/lib/beanstalk_client');
var client     = beanstalk.Client();

exports.push = function(data) {
  client.use(tube).onSuccess(function() {
    client.put(data);
  });
};