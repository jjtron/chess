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

io.on('connection', (socket) => {
  socket.on('register', () => {
    socket.emit('registrationID', socket.id);
  });

  socket.on('hand_shake', (opponent) => {
    io.to(opponent).emit('message_to_opponent',
        { 
          message: socket.id,
          from: socket.id
        }
      )
  });

  socket.on('hand_shake_response', (opponent) => {
    io.to(opponent).emit('response_from_opponent', 'Handshake with opponent, ' + socket.id + ', success.');
  })

  socket.on('move', (move) => {
    console.log('MOVE: ', move);
  })

// BEGIN: for test only when using the 'index.html'
/*
fs = require('fs'),
index = fs.readFileSync(__dirname + '/index.html');

app.get('/', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.end(index);
});
*/
// END: for test only when using the 'index.html'

// BEGIN: for test only
/*
socket.on('i am client', () => {
  const resFn = setTimeout(() => {
    io.emit( 'myid', socket.id );
  }, 3000);
  setTimeout(() => {
    clearTimeout(resFn);
  }, 5000);
});
*/
// END: for test only
});

const PORT=`3003`; //${Math. floor(Math. random()*10)}`;
httpServer.listen(Number(PORT), () => {
  console.log(`listening on *:${PORT}`);
}); 