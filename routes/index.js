var mongoose = require('mongoose');
const UserController = require('../controllers/user');
const User = require('../models/user');
module.exports = function(app, io) {
  /* GET home page. */
  app.get('/', UserController.userGetSignin);
  app.post('/', UserController.userPostSignin);
  app.get('/chat', UserController.userGetChat);
  app.get('/logout', UserController.userGetSignout);

  /* Socket IO connection */
  var onlineCount = 0;
  var userList = [];
  io.on('connection', function(socket) {
    onlineCount++;
    socket.on('join room', function(msg) {
      var username = socket.handshake.session.username;
      userList.push(username);
      io.emit('join room', {
        onlineUsers: onlineCount,
        message: username + ' đã tham gia vào cuộc trò chuyện',
        users: userList
      });
    });
    socket.on('chat message', function(msg) {
      var username = null;
      username = socket.handshake.session.username;
      io.emit('chat message', { username: username, message: msg.message });
      username = msg.username;
    });
    socket.on('disconnect', async function() {
      const indexLeft = userList.findIndex(
        el => el === socket.handshake.session.username
      );
      onlineCount = Math.max(0, onlineCount - 1);
      userList.splice(indexLeft, 1);
      socket.broadcast.emit('left room', {
        message:
          socket.handshake.session.username + ' đã rời khỏi cuộc trò chuyện',
        onlineUsers: onlineCount,
        indexUserLeft: indexLeft
      });

      mongoose.connect(process.env.MONGO_CONNECT);
      try {
        const user = await User.findOneAndRemove({
          name: socket.handshake.session.username
        });
        if (user) {
          delete socket.handshake.session.username;
          socket.handshake.session.save();
        }
      } catch (error) {
        console.log(error);
      }
      console.log('disconnect');
    });
  });
};
