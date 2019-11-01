const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');
const axios = require('axios');
const routes = require('./routes.js');
const ApiKey = require('../ignore');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

const getApiAndEmit = async (socket) => {
  try {
    const res = await axios.get(
      `https://api.darksky.net/forecast/${ApiKey}/37.8267,-122.4233`,
    ); // Getting the data from DarkSky
    socket.emit('FromAPI', res.data.currently.temperature); // Emitting a new message. It will be consumed by the client
  } catch (error) {
    console.error(`Error: ${error.code}`);
  }
};

app.use(express.static(path.resolve(__dirname, '../dist')));

// io.on('connection', (client) => {
//   client.on('subscribeToTimer', (interval) => {
//     console.log('client is subscribing to timer with interval ', interval);
//     setInterval(() => {
//       client.emit('timer', new Date());
//     }, interval);
//   });
// });

io.on('connection', (client) => {
  console.log('a user connected');


  setInterval(
    () => getApiAndEmit(client),
    10000,
  );


  client.on('disconnect', () => console.log('a user disonnected'));
});


// app.get("/", (req, res) => {
//   // res.send(`<h1> Here's some HTML for your bitch ass </h1>`);
//   res.sendFile(path.join(__dirname, "../dist/index.html"));
// })

// https://api.darksky.net/forecast/289097115a1fe942506c4d6c8dd58f9f/37.8267,-122.4233

server.listen(port, () => console.log('listening on port ', port));
