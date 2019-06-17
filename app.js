const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server).sockets;
const path = require('path');
const port = process.env.port || 8080;

app.use(express.static(path.join(__dirname, 'public')));

server.listen(port, () => console.log(`Server running on port ${port}`));

// 监听socket连接
io.on('connection', socket => {
  console.log('A client connected');

  // 处理画线的socket请求
  socket.on('drawstart', data => {
    // 广播除连接者外的画线相关信息
    socket.broadcast.emit('drawing', data);
  });

  socket.on('disconnected', () => {
    console.log('Client disconnected');
  });
});
