const express = require('express'),
  app = express(),
  http = require('http').Server(app),
  io = require('socket.io')(http);

app.use(express.static('public'))
app.get('/', (req, res) => res.sendFile('index.html'))

const getNumberOfConnections = () => Object.keys(io.sockets.connected).length

io.on('connection', (socket) => {
  io.emit('getNumberOfConnections', getNumberOfConnections())
  socket.on('disconnect', () => io.emit('getNumberOfConnections', getNumberOfConnections()))
  socket.on('chat-message', (msg) => socket.broadcast.emit('chat-message', msg))
  socket.on('joined', (name) => socket.broadcast.emit('joined', name))
  socket.on('left', (name) => socket.broadcast.emit('left', name))
  socket.on('typing', (data) => socket.broadcast.emit('typing', data))
  socket.on('stoptyping', () => socket.broadcast.emit('stoptyping'))
})

http.listen(3000, () => console.log('Server is started at http://localhost:3000'))