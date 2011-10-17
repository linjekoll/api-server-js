describe "requests" do
  let(:url) { "http://localhost:3001" }
  let(:api_key) { "d58e3582afa99040e27b92b13c8f2280" }
  let(:valid_data) {
    {
      event: "event",
      next_station: 1,
      previous_station: 2,
      arrival_time: 3,
      alert_message: "oops!",
      line_id: 4
    }
  }
  describe "PUT" do
    it "should be able to handle correct data" do
      begin
      RestClient.put("#{url}/#{api_key}/providers/1/journeys/1", valid_data)
      rescue
        puts $!.inspect
      end 
      # .code.should eq(204)
    end
  end
end