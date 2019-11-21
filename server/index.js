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

  let roomName = 'general';

  client.on('create room', (room) => {
    roomName = room;
    client.join(roomName);
  });

  client.on('append message', (message) => {
    console.log('message: ', message);
    client.to(roomName).emit('append message', message);
  });

  client.on('disconnect', () => console.log('a user disonnected'));
});

server.listen(port, () => console.log('listening on port ', port));
