require "rspec"
require "rest-client"

RSpec.configure do |config|
  config.mock_with :rspec
end

def visit(url, data, type)
  RestClient.send(type, url, data)
end