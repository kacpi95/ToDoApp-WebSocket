const express = require('express');
const socket = require('socket.io');
const randomId = require('shortid');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'clinet')));
const server = app.listen(8000, () => {
  console.log('Server is running port: 8000');
});
const io = socket(server);

const tasks = [
  { id: 1, name: 'Shopping' },
  {
    id: 2,
    name: 'Cleaning',
  },
];
io.on('connection', (socket) => {
  socket.emit('updateData', tasks);
});
