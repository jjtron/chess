const express = require('express');
var cors = require('cors');
const app = express();

console.log('CORS origin: ', process.env.ORIGIN);
app.use(cors({
    origin: process.env.ORIGIN
}));
 
const http = require('http');
const httpServer = http.createServer(app);
const io = require("socket.io")(httpServer, {
    cors: {
      origin: process.env.ORIGIN,
      methods: ['GET','POST']
    }
});

io.on('connection', (socket) => {
  socket.on('register', () => {
    socket.emit('registrationID', socket.id);
  });

  socket.on('hand_shake', (adversaryID) => {
    io.to(adversaryID).emit('message_to_opponent',
        { 
          message: socket.id,
          from: socket.id
        }
      )
  });

  socket.on('hand_shake_response', (adversaryID) => {
    io.to(adversaryID).emit('response_from_opponent', 'Handshake with opponent, ' + socket.id + ', success.');
  })

  socket.on('move', (move) => {
    io.to(move.adversaryID).emit('remote_move', move);
  });

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