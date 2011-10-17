var sys = require("sys");

/* 
  @data String Prints the given string.
*/
exports.debug = function(data) {
  sys.puts(sys.inspect(data));
};