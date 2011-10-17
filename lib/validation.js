exports.eval = function(data) {
  var Validator = require('validator').Validator;
  var v = new Validator();
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

  var acceptedEvents = ["did_leave_station", "update", "alert"];
  v.check(data.event, 'Error in event'). in (acceptedEvents);
  v.check(data.journey_id, 'Error in id').notNull().notEmpty().isAlphanumeric();
  v.check(data.previous_station, 'Error in origin_station').isInt().min(1);
  v.check(data.next_station).isInt().min(1);
  v.check(data.arrival_time).isInt().min(1);
  v.check(data.provider_id).isInt().min(1);
  v.check(data.journey_id).isInt().min(1);
  v.check(data.line_id).isInt().min(1);
  return v.getErrors();
};