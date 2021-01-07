// Copyright 2017 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

// [START gae_node_request_example]
const express = require('express');

const app = express();
const bodyParser = require('body-parser');

const cors = require('cors');
const jsonParser = bodyParser.json();
let clientId;
app.use(cors({
  origin: 'https://jeeva.dev'
}));


const admin = require("firebase-admin");

admin.initializeApp();

app.get('/', (req, res) => {
  res.status(200).send('Hello!').end();
});

// create a route for the app
app.post('/register', jsonParser, (req, res) => {
  console.log('/register');
  clientId = req.body.token;
  res.send('Token registered');
});

// another route
app.get('/connect', (req, res) => {
  console.log('/connect');
  const message={
    "token": clientId,
    "notification": {
      "title": "Jeeva dev user",
      "body": "Incoming call from Jeeva.dev user"
    },
    "webpush": {
      "fcm_options": {
        "link": "https://jeeva.dev/#/chat"
      }
    }
  };

  admin.messaging().send(message).then(response => {
  }).catch(error => {
    console.log('Error sending FCM message: ', error);
  })
  res.send('Hello!');
});

app.get('/healthcheck', (req, res) => {
  console.log('healthcheck ...');
  res.send('OK');
});

// Start the server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
  console.log('Press Ctrl+C to quit.');
});
// [END gae_node_request_example]

module.exports = app;
