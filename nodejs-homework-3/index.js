const express = require('express');
const router = require('./src/routes/routes');
const cors = require('cors');
const morgan = require('morgan');

const bodyParser = require('body-parser');
const {serverErrorHandler} = require('./src/middlewares/ErrorHandler');

require('./src/db/connections');

const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use('/', router);

const http = require('http');
const server = http.createServer(app);
const {Server} = require('socket.io');
const socket = new Server(server);

socket.on('connection', (socket) => {
  socket.emit('Hello from server');
  socket.on('hello from client');
});
server.listen(8000);
app.use(serverErrorHandler);
const PORT = process.env.PORT || 8080;
app.listen(PORT);

