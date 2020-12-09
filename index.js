/* eslint max-len: ["error", { "ignoreStrings": true }] */
const express = require('express');
const bodyParser = require('body-parser'); // eslint-disable-line
const axios = require('axios');

const app = express();
app.use(bodyParser.json());

const events = [];

app.post('/events', async (req, res) => {
  // takes whatever is in body and send to the different services
  /**
   * The goal of this service is to act as a event bus,
   * that receives an event from any service and send back
   * the data received to the rest of the involved services.
   * 1. posts-service
   * 2. comments-service
   * 3. query-service
   * 4.
   */
  const event = req.body;

  // store all the events ocurred in the app
  events.push(event);

  /**
   * We need to replace localhost:400X with the name of the Service:
   * @type kubectl get services
   * In order to stasblish communication between the services inside
   * the cluster since we're using kubernetes
   */
  await axios.post('http://posts-clusterip-srv:4000/events', event); // send event response to posts
  await axios.post('http://comments-srv:4001/events', event); // send event response to comments
  await axios.post('http://query-srv:4002/events', event); // send event reponse to query
  await axios.post('http://moderation-srv:4003/events', event); // send event reponse to moderation

  res.send({ status: 'OK' });
});

app.get('/events', async (req, res) => {
  res.send(events);
});

app.listen(4005, () => {
  // 4005 is the port that we will be typing in kubernetes
  // for the event-bus-depl.yaml in ports
  console.log('EVENT_BUS SERVICE: Listening on port 4005');
});
