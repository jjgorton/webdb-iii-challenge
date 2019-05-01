const express = require('express');
const helmet = require('helmet');

const cohortsRouter = require('./cohorts/cohorts-route');
const studentsRouter = require('./students/students-route');

const server = express();

server.use(express.json());
server.use(helmet());

server.get('/api', (req, res) => {
	res.send(`<h1>Lambda API - by Josh Gorton</h1>`);
});

server.use('/api/cohorts', cohortsRouter);
server.use('/api/students', studentsRouter);

module.exports = server;
