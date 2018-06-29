var mongoose = require('mongoose');
const User = require('../models/user');
module.exports = function(app, io) {
  /* GET home page. */
  app.get('/', function(req, res, next) {
    res.render('index', { title: 'Welcome to Message Chat' });
  });
  app.post('/', async function(req, res, next) {
    if (req.body.username) {
      req.session.username = req.body.username;
      mongoose.connect(process.env.MONGO_CONNECT);
      try {
        const userExist = await User.findOne({ name: req.body.username });
        if (!userExist) {
          const user = new User({
            name: req.body.username
          });
          user.save(function(err, result) {
            if (err) {
              console.log(err);
              return res
                .status(409)
                .json({ message: 'Tên không hợp lệ có lẽ do quá dài' });
            }
            if (result) {
              mongoose.disconnect();
            }
          });
          res.status(200).json({ message: 'success' });
        } else {
          return res
            .status(409)
            .json({ message: 'Tên đã tồn tại hãy chọn tên khác' });
        }
      } catch (error) {
        console.log(error);
        return res.status(409).json({ message: 'Kết nối lỗi' });
      }
    } else {
      res.status(409).json({ message: 'Tên không được để trống' });
    }
  });
  app.get('/chat', function(req, res, next) {
    if (req.session.username) {
      res.render('chat', { title: 'Chat Box' });
    } else {
      res.redirect('/');
    }
  });
  app.get('/logout', function(req, res, next) {
    console.log(req.session.username);
    req.session.username = null;
    res.redirect('/');
  });
  var onlineCount = 0;

  io.on('connection', function(socket) {
    onlineCount++;
    socket.on('join room', function(msg) {
      var username = socket.handshake.session.username;
      console.log(onlineCount);
      io.emit('join room', {
        onlineUsers: onlineCount,
        message: username + ' đã tham gia vào cuộc trò chuyện'
      });
    });
    socket.on('chat message', function(msg) {
      var username = null;
      username = socket.handshake.session.username;
      io.emit('chat message', { username: username, message: msg.message });
      username = msg.username;
    });
    socket.on('disconnect', async function() {
      onlineCount = Math.max(0, onlineCount - 1);
      socket.broadcast.emit('left room', {
        message:
          socket.handshake.session.username + ' đã rời khỏi cuộc trò chuyện',
        onlineUsers: onlineCount
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
