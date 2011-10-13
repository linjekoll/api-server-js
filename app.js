
/**
 * Module dependencies.
 */

var express = require('express');
require('express-namespace');
var bs = require('nodestalker/lib/beanstalk_client');
var client = bs.Client();
var tube = 'tube';
var app = module.exports = express.createServer();
// nodestalker config



// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true })); 
});

app.configure('production', function(){
  app.use(express.errorHandler()); 
});

// Routes

app.namespace('/:api_key/', function () {
  
});

app.get('/get', function(req, res) {
  client.watch(tube).onSuccess(function(data) {
    client.reserve().onSuccess(function(job) {
      console.log(job);
    });
  });
});

app.get('/put', function(req, res){
  console.log("Put!");
  client.use(tube).onSuccess(function(data) {
  console.log(data);

  client.put('my job').onSuccess(function(data) {
    console.log(data);
    client.disconnect();
  });
});
});

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
