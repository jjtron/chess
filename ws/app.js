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
      methods: ['GET','POST']
    }
});

fs = require('fs'),
// NEVER use a Sync function except at start-up!
index = fs.readFileSync(__dirname + '/index.html');

app.get('/', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
});

// Send current time to all connected clients
function sendTime() {
    io.emit('time', { time: new Date().toJSON() });
}

// Send current time every 10 secs
setInterval(sendTime, 3000);

io.on('connection', (socket) => {
  console.log('a user connected');
  // Use socket to communicate with this particular client only, sending it it's own id
  socket.emit('welcome', { message: 'Welcome!', id: socket.id });
  socket.on('i am client', (data) => {
    console.log(data, socket.id);
  });
});

const PORT=`3002`; //${Math. floor(Math. random()*10)}`;
httpServer.listen(Number(PORT), () => {
  console.log(`listening on *:${PORT}`);
});