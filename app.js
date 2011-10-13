
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

app.namespace('/:api_key/providers', function () {
  app.namespace('/:provider_id', function() {
    app.namespace('/journeys', function() {
      /*
       *  /:api_key/providers/:provider_id/journeys
       */
      app.get('/', function(req, res) {
        console.log("Got a journey listing request for provider id: " 
        + req.params.provider_id);
      });
      
      /*
       *  /:api_key/providers/:provider_id/journeys/:journey_id
       */
      app.put('/:journey_id', function(req, res) {
        console.log("Got a put request for provider id: " 
        + req.params.provider_id 
        + " and journey id: " 
        + req.params.journey_id);
      });
    });
    
    /*
     *  /:api_key/providers/:provider_id/lines
     */
    app.namespace('/lines', function() {
      app.get('/', function(req, res) {
        console.log("Got a line listing request for provider id: "
        + req.params.provider_id);
      });
    });
  });

  /*
  *  /:api_key/providers/
  */
  app.get('/', function(req, res) {
    console.log("Requested provider listing - route: GET /" + req.params.api_key + "/providers");
  });
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
