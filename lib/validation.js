/*
 @data Object Validates object
 Example on a valid object
 {
   event: "did_leave_station",
   next_station: 8998235,
   previous_station: 898345,
   arrival_time: 1318843870,
   alert_message: "oops!",
   line_id: 2342
 }
 @return Array A list of errors
 Example ["id is not an int"]
*/
exports.eval = function(data) {
  var Validator, v, acceptedEvents;
  
  Validator = require('validator').Validator;
  v = new Validator();
  v.errors = [];

  v.error = function(msg) {
    this.errors.push(msg);
    return this;
  };

  v.getErrors = function() {
    var messages = this.errors.slice();
    this.errors = [];
    return messages;
  };
  
  /* What events are valid? */
  acceptedEvents = [
    "did_leave_station", 
    "update", 
    "alert"
  ];
  
  v.check(data.event, 'Error in event'). in (acceptedEvents);
  v.check(data.journey_id, 'Error in id').notNull().notEmpty().isAlphanumeric();
  v.check(data.previous_station, 'Error in previous_station').isInt().min(1);
  v.check(data.next_station).isInt().min(1);
  v.check(data.arrival_time).isInt().min(1);
  v.check(data.provider_id).isInt().min(1);
  v.check(data.journey_id).isInt().min(1);
  v.check(data.line_id).isInt().min(1);
  return v.getErrors();
};