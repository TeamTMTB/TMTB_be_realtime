const { count } = require("console");
const express = require("express");
const http = require("http");
const bodyParser = require('body-parser');
const { resolve } = require("path");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);

const room = require('./controller/roomsController/roomRouter.js');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/rooms', room);


server.listen(8000, () => console.log("server is running on port 8000"));