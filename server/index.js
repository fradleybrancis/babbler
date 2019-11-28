/* eslint-disable no-param-reassign */
const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const path = require('path');


const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const port = process.env.PORT || 3000;

app.use(express.static(path.resolve(__dirname, '../dist')));

const rooms = ['General'];

const allMessages = { General: [] };

io.on('connection', (client) => {
  client.room = 'General';
  client.join(client.room);
  client.emit('update rooms', rooms);
  client.emit('get history', allMessages[client.room]);

  client.on('add user', (username) => {
    client.username = username;
    client.broadcast.in(client.room).emit('append message', { username: client.username, text: 'Joined the Room' });
  });

  client.on('create room', (room) => {
    for (let i = 0; i < rooms.length; i += 1) {
      if (rooms[i] === room) {
        return;
      }
    }
    client.leave(client.room);
    client.broadcast.in(client.room).emit('append message', { username: client.username, text: 'Left the Room' });
    allMessages[room] = [];
    rooms.push(room);
    client.join(room);
    client.room = room;
    io.emit('update rooms', rooms);
  });

  client.on('switch room', (room) => {
    client.leave(client.room);
    client.broadcast.in(client.room).emit('append message', { username: client.username, text: 'Left the Room' });
    client.join(room);
    client.room = room;
    client.broadcast.in(client.room).emit('append message', { username: client.username, text: 'Joined the Room' });
    client.emit('get history', allMessages[client.room]);
  });

  client.on('typing', () => {
    client.broadcast.in(client.room).emit('typing', `${client.username} is typing`);
  });


  client.on('append message', (data) => {
    if (data.text === '') return;
    allMessages[client.room].push({ username: data.username, text: data.text });
    io.in(client.room).emit('append message', data);
  });

  client.on('disconnect', () => io.emit('append message', { username: client.username, text: 'Has Just Disconnected' }));
});

server.listen(port, () => console.log('listening on port ', port));
