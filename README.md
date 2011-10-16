# API server for Linjekoll
## In general
Handles:

- validation
- pushing data to beanstalk
  
## API reference

Request URLs adhere to the following format:

PUT: `/:api_key/providers/:provider_id/journeys/:journey_id`

Returns:

JSON data in the following format:
`{valid: (true|false)[, errors: {}]}`

## Setup

Install node.js ~> 0.4.2 and npm.

Then install dependencies and run the server by typing: 

`npm install -d && node app.js`.


## Present functionality

- Doesn't check API-keys

Routes:

`PUT: /:api_key/providers/:provider_id/journeys/:journey_id`

`/pop` - get the pending job from beanstalk

`/push` - push a dummy job into beanstalk
