require('jasmine-node');
var rest = require('restler');
describe("description", function() {
  it("description", function() {
    rest.get("http://www.google.com").on('complete', function(data, response) {
      expect(data).toMatch(/jesper/i);
    });
  });
});