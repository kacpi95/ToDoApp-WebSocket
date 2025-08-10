const express = require('express');
const socket = require('socket.io');
const randomId = require('shortid');
const path = require('path');

const app = express();
app.use(express.static(path.join(__dirname, 'client')));
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
  socket.on('addTask', (task) => {
    if (!task.id) {
      task.id = randomId.generate();
    }
    tasks.push(task);
    socket.broadcast.emit('addTask', task);
  });
  socket.on('removeTask', (id) => {
    const index = tasks.findIndex((el) => el.id === id);
    if (index !== -1) {
      tasks.splice(index, 1);
      socket.broadcast.emit('removeTask', id);
    }
  });
});
