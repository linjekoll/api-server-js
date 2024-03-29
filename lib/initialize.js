/*
  Initializes the application.
  @return Object An express object
*/
exports.initialize = function() {
  var express    = require('express'); require('express-namespace');
  var app        = module.exports = express.createServer();
  
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
  
  return app;
};