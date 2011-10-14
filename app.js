
/**
* Module dependencies.
*/

var express = require('express');
require('express-namespace');
var bs        = require('nodestalker/lib/beanstalk_client');
var client    = bs.Client();
var tube      = 'tube';
var app       = module.exports = express.createServer();


// Validator configuration
var check = require('validator').check;

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
        + req.params.journey_id
        + " and body: ", req.body);
        
        var data = req.body;
        data.journey_id = req.params.journey_id;
        data.provider_id = req.params.provider_id;
        
        result = app.validate(data);
        if (!result.valid) {
          res.send("Not valid :( " + result.message);
        } else {
          res.send("Valid!");
        }
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

app.get('/pop', function(req, res) {
  console.log("Pop!");
  client.watch(tube).onSuccess(function(data) {
    client.reserve().onSuccess(function(job) {
      console.log(job);
    });
  });
});

app.get('/push', function(req, res){
  console.log("Push!");
  client.use(tube).onSuccess(function(data) {
    console.log(data);

    client.put('my job').onSuccess(function(data) {
      console.log(data);
      client.disconnect();
    });
  });
});

// Validation

app.validate = function(data) {
  var acceptedEvents = 
  [
    "did_leave_station",
    "update",
    "alert"  
  ];
  try {
    check(data.event).notNull().in(acceptedEvents);
    check(data.id).notNull().notEmpty().isAlphanumeric();
    check(data.origin_station).isInt().min(1);
    // check(data.destination_station).isInt().min(1);
    // check(data.arrival_time).isInt();
    // check(data.provider_id).isInt().min(1);
    // check(data.line_id).isInt().min(1);
  } catch (e) {
    return {valid: false, message: e.message};
  }
  return {valid: true};
};

app.listen(3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
