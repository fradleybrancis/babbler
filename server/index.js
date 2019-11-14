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

app.use(express.static(path.resolve(__dirname, '../dist')));

io.on('connection', (client) => {
  console.log('a user connected');

  client.on('append message', (message) => {
    console.log('message: ', message);
    io.emit('append message', message);
  });

  client.on('disconnect', () => console.log('a user disonnected'));
});

// https://api.darksky.net/forecast/289097115a1fe942506c4d6c8dd58f9f/37.8267,-122.4233

server.listen(port, () => console.log('listening on port ', port));
