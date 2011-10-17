var sys = require("sys");
exports.debug = function(data) {
  sys.puts(sys.inspect(data));
};