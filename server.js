const express = require('express');
const socket = require('socket.io');
const randomId = require('shortid');
const path = require('path');

const app = express();
const io = socket(server);
const tasks = [
  { id: 1, name: 'Shopping' },
  {
    id: 2,
    name: 'Cleaning',
  },
];
app.use(express.static(path.join(__dirname, 'clinet')));

const server = app.listen(8000, () => {
  console.log('Server is running port: 8000');
});
