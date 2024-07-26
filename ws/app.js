const express = require('express');
var cors = require('cors');
const app = express();
app.use(cors({
    origin: 'http://localhost:3000'
}));
const http = require('http');
const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
      origin: '*',
      methods: 'GET'
    }
  });

// Send current time to all connected clients
function sendTime() {
    io.emit('time', { time: new Date().toJSON() });
}

// Send current time every 10 secs
setInterval(sendTime, 3000);

io.on('connection', (socket) => {
  console.log('a user connected');
});

httpServer.listen(3001, () => {
  console.log('listening on *:3001');
});
