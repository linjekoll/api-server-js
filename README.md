# API server for Linjekoll

Handles:

- validation
- pushing data to beanstalk

A live server can be found [here](http://46.16.232.244:3001/).

## Installation

Start by cloning the project.

`git clone git@github.com:linjekoll/api-server-js.git`

Navigate to the downloaded folder and run bundler.

`cd api-server-js && bundle install`

Start the server by running `foreman start`.
  
## API requests


### PUT: /:api_key/providers/:provider_id/journeys/:journey_id

- **api_key** (String) An API key provided by linjekoll.
- **provider_id** (Integer) You provider id, should be a uniq id from out database.
- **journey_id** (Object) What journey/trip should be updated? This might be any value.

Ingoing data.

``` javascript
{
  event: "event",
  next_station: 8998235,
  previous_station: 898345,
  arrival_time: 1318843870,
  alert_message: "oops!",
  line_id: 2342
}
```

- **event** (String) ("did_leave_station"|"update"|"alert") What event was triggered?
- **previous_station** (Integer) What is the previous? Value from database, `station_id`.
- **next_station** (Integer) Where are we headed? Value from database, `station_id`.
- **arrival_time** (Integer) When is the train ariving at `next_station`? This should be a [unix time stamp](http://en.wikipedia.org/wiki/Unix_time).
- **alert_message** (String) Is there anything wrong ? This might be `null`.
- **line_id** (Integer) What line do we want to update? Value from database, `line_id`.

Returns 204 if everything went okay, otherwise 400.

An 400 request returns this data.

``` javascript
{
  valid: false
  errors: {
    
  }
}
```

## GET /

Just a heartbeat.

## Setup

Install node.js ~> 0.4.12 and npm.

Then install dependencies and run the server by typing: 

`npm install -d && node app.js`.


## Present functionality

- Doesn't check API-keys

Routes:

`PUT: /:api_key/providers/:provider_id/journeys/:journey_id`

`/pop` - get the pending job from beanstalk

`/push` - push a dummy job into beanstalk