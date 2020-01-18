//*VARIABLES & IMPORTS
const express = require('express');
const server = express();
const postsRouter = require('./posts/posts-router');

//*MIDDLEWARE 
server.use(express.json());
server.use('/api/posts', postsRouter);
//*

server.get('/', (req, res) => {
  res.send('Server is running!')
});

module.exports = server;