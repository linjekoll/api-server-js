require "rspec"
require "rest-client"
require "jsonify"

RSpec.configure do |config|
  config.mock_with :rspec
end

def visit(url, data = nil, type = :get)
  RestClient.send(type, url, data)
rescue RestClient::Exception => error
  Struct.new(:body, :code).new(JSON.parse(error.http_body), error.http_code)
end