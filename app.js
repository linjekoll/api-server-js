var validate = require("./lib/validation.js");
var helper = require("./lib/helper.js");
var queue = require("./lib/queue.js");
var app = require("./lib/initialize.js").initialize();

/*
* Journeys resource
*/
app.namespace('/:api_key/providers/:provider_id/journeys', function() {
  /*
  *  /:api_key/providers/:provider_id/journeys
  */
  app.get('/', function(req, res) {
    console.log("Got a journey listing request for provider id: " + req.params.provider_id);
  });

  /*
  *  /:api_key/providers/:provider_id/journeys/:journey_id
  */
  app.put('/:journey_id', function(req, res) {
    helper.debug("Request was made to /:journey_id");
    var data = req.body;
    data.journey_id = req.params.journey_id;
    data.provider_id = req.params.provider_id;

    errors = validate.eval(data);
    if (errors.length > 0) {
      helper.debug("Request was not valid, " + errors.length + " error(s) found.");
      res.json({
        valid: false,
        errors: errors
      },
      400);
    } else {
      helper.debug("Everything went okay");
      queue.push(data);
      res.send();
    }
  });
});

/* 
* Lines resource
*/
app.namespace('/:api_key/providers/:provider_id/lines', function() {
  /*
  *  /:api_key/providers/:provider_id/lines
  */
  app.get('/', function(req, res) {
    console.log("Got a line listing request for provider id: " + req.params.provider_id);
  });
});

/*
  Providers resource
*/
app.namespace('/:api_key/providers', function() {
  /*
  * /:api_key/providers/
  */
  app.get('/', function(req, res) {
    console.log("Requested provider listing - route: GET /" + req.params.api_key + "/providers");
  });
});

/*
 Just a heartbeat
*/
app.get("/", function(req, res) {
  res.json({heartbeat: true})
})

app.listen(3001);
console.log("Express server listening on port %d in %s mode, beanstalkd started on port %d", app.address().port, app.settings.env, 11300);