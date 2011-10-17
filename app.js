
/**
* Module dependencies.
*/

var express   = require('express'); require('express-namespace');
var sys       = require("sys");
var bs        = require('nodestalker/lib/beanstalk_client');
var client    = bs.Client();
var tube      = 'lineart.update';
var app       = module.exports = express.createServer();


/* Prints the given argument */
var debug = function(data) {
  sys.puts(sys.inspect(data));
};

// Validator configuration
var Validator = require('validator').Validator;
var v = new Validator();
v.errors = [];

v.error = function (msg) {
  this.errors.push(msg);
  return this;
};
v.getErrors = function() {
  var messages = this.errors.slice();
  this.errors = [];
  return messages;
};

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
        
        errors = app.validate(data);
        if(errors.length > 0){
          res.json({valid: false, errors: errors}, 400);
        } else {
          // app.toBeanstalk(data);
          res.send();
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
      res.send(job.data);
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
  var acceptedEvents = [
    "did_leave_station",
    "update",
    "alert"  
  ];
  
  v.check(data.event, 'Error in event').in(acceptedEvents);
  v.check(data.journey_id, 'Error in id').notNull().notEmpty().isAlphanumeric();
  v.check(data.previous_station, 'Error in origin_station').isInt().min(1);
  v.check(data.next_station).isInt().min(1);
  v.check(data.arrival_time).isInt().min(1);
  v.check(data.provider_id).isInt().min(1);
  v.check(data.journey_id).isInt().min(1);
  v.check(data.line_id).isInt().min(1);
  return v.getErrors();
};

// Beanstalk

app.toBeanstalk = function(data) {
  client.use(tube).onSuccess(function() {
    client.put(data);
  });
};

app.listen(3001);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
