const { count } = require("console");
const express = require("express");
const http = require("http");
const bodyParser = require('body-parser');
const { resolve } = require("path");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const redisAdapter = require('socket.io-redis');
const room = require('./controller/roomsController/roomRouter.js');
const realTimeOpen = require('./controller/real-time/real-timeController.js');
const connectInfo = require("./redis-connect-info.json");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/rooms', room);

io.adapter(redisAdapter({   
    host: connectInfo.host, 
    port: connectInfo.port,
    password: connectInfo.password
}));
realTimeOpen(io);

server.listen(8000, () => console.log("server is running on port 8000"));
