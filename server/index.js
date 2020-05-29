const http = require('http');          // For creating http server
const express = require('express');    // 
const socketio = require('socket.io'); // For web sockets
const cors = require('cors');          // 
const router = require('./router');    // To display message in web
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');



const app = express();                 // Express app
const server = http.createServer(app); // Create Server
const io = socketio(server);           // Instance of socketio

app.use(cors()); // 
app.use(router); // Use router as middleware

io.on('connect', (socket) => {    // socket - connected as client side connect
  
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if(error) return callback(error);

    socket.join(user.room);

    socket.emit('message', { user: 'admin', text: `${user.name}, welcome to room ${user.room}.`});
    socket.broadcast.to(user.room).emit('message', { user: 'admin', text: `${user.name} has joined!` });

    io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room) });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', { user: user.name, text: message });

    callback();
  });

  socket.on('disconnect', () => { // When user leaves
    const user = removeUser(socket.id);

    if(user) {
      io.to(user.room).emit('message', { user: 'Admin', text: `${user.name} has left.` });
      io.to(user.room).emit('roomData', { room: user.room, users: getUsersInRoom(user.room)});
    }
  })
});

server.listen(process.env.PORT || 5000, () => console.log(`Server has started.`));