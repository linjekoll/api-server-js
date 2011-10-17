/**
* Module dependencies.
*/

var express   = require('express'); require('express-namespace');
var app       = module.exports = express.createServer();
var validate  = require("./lib/validation.js");
var helper    = require("./lib/helper.js");
var queue     = require("./lib/queue.js");

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
        
        errors = validate.eval(data);
        if(errors.length > 0){
          res.json({valid: false, errors: errors}, 400);
        } else {
          queue.push(data); res.send();
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

app.listen(3001);
console.log("Express server listening on port %d in %s mode, beanstalkd started on port %d", app.address().port, app.settings.env, 11300);
