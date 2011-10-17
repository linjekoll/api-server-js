describe "requests" do
  let(:url) { "http://localhost:3001" }
  let(:api_key) { "d58e3582afa99040e27b92b13c8f2280" }
  let(:valid_data) {
    {
      event: "did_leave_station",
      next_station: 1,
      previous_station: 2,
      arrival_time: 3,
      alert_message: "oops!",
      line_id: 4
    }
  }
  
  describe "GET" do
    it "should have a heartbeat" do
      visit(url).code.should eq(200)
    end
  end
  
  describe "PUT" do
    let(:visit_url) { "#{url}/#{api_key}/providers/1/journeys/1" }
    
    it "should be able to handle valid data" do
      visit(visit_url, valid_data, :put).code.should eq(204)
    end
    
    it "should accept an empty alert message" do
      visit(visit_url, valid_data.merge(alert_message: nil), :put).code.should eq(204)
    end
    
    describe "non valid" do
      it  "should not care for an event that doesn't exist" do
        @request = visit(visit_url, valid_data.merge(event: "invalid"), :put)
        @request.body["errors"].should include("Error in event")
      end
      
      it  "should not care for non int next_station" do
        @request = visit(visit_url, valid_data.merge(next_station: "invalid"), :put)
        @request.body["errors"].should include("Invalid integer")
      end
      
      it "should not care for non int previous_station" do
        @request = visit(visit_url, valid_data.merge(previous_station: "invalid"), :put)
        @request.body["errors"].should include("Error in origin_station")
      end
      
      it "should not care for non int arrival_time" do
        @request = visit(visit_url, valid_data.merge(arrival_time: "invalid"), :put)
        @request.body["errors"].should include("Invalid integer")
      end
      
      it "should not care for non int line_id" do
        @request = visit(visit_url, valid_data.merge(line_id: "invalid"), :put)
        @request.body["errors"].should include("Invalid integer")
      end
      
      it "should not care for non int provider_id" do
        @request = visit("#{url}/#{api_key}/providers/invalid/journeys/1", valid_data, :put)
        @request.body["errors"].should include("Invalid integer")
      end
      
      it "should not care for non int journey_id" do
        @request = visit("#{url}/#{api_key}/providers/1/journeys/invalid", valid_data, :put)
        @request.body["errors"].should include("Invalid integer")
      end
      
      after(:each) do
        @request.code.should eq(400)
      end
    end
  end
end