const express = require('express');
var cors = require('cors');
const app = express();
const PRODORIGIN = 'https://chess.gp-web-dev.com:8444';
const DEVORIGIN = 'http://localhost:3000';
app.use(cors({
    origin: DEVORIGIN
}));
const http = require('http');
const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
      origin: DEVORIGIN,
      methods: ['GET','POST']
    }
});

// BEGIN: for test only when using the 'index.html'
fs = require('fs'),
// NEVER use a Sync function except at start-up!
index = fs.readFileSync(__dirname + '/index.html');

app.get('/', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
});
// END: for test only when using the 'index.html'

// Send current time every 10 secs
// setInterval(sendTime, 3000);
let rooms = [];

io.on('connection', (socket) => {
  socket.on('register', (data) => {
    rooms.push(socket.id);
  });
  socket.on('cleanup', () => {
    const list = getList().then((list) => {
      for (const socket of list) {
        if (rooms.indexOf(socket.id) === -1) {
          socket.disconnect();
        }
      }
    });
  })
  
  // for test only
  socket.on('i am client', () => {
    const resFn = setTimeout(() => {
      io.emit( 'myid', socket.id );
    }, 3000);
    setTimeout(() => {
      clearTimeout(resFn);
    }, 5000);
  });
  // for test only
});

async function getList() {
  const sockets = await io.fetchSockets();
  return sockets;
};

const PORT=`3003`; //${Math. floor(Math. random()*10)}`;
httpServer.listen(Number(PORT), () => {
  console.log(`listening on *:${PORT}`);
}); 