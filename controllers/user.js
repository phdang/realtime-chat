var mongoose = require('mongoose');
const User = require('../models/user');

exports.userGetSignin = function(req, res, next) {
  res.render('index', { title: 'Welcome to Message Chat' });
};
exports.userPostSignin = async function(req, res, next) {
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
        if (
          new Date(userExist.timestamp).getTime() + 2 * 60 * 60 * 1000 <
          new Date().getTime()
        ) {
          userExist.timestamp = new Date().getTime();
          userExist.save(function(err, result) {
            if (err) {
              return res
                .status(409)
                .json({ message: 'Lỗi cập nhật thời gian' });
            }
            if (result) {
              return res.status(200).json({ message: 'success' });
            }
          });
        } else {
          return res
            .status(409)
            .json({ message: 'Tên đã tồn tại hãy chọn tên khác' });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(409).json({ message: 'Kết nối lỗi' });
    }
  } else {
    res.status(409).json({ message: 'Tên không được để trống' });
  }
};
exports.userGetChat = function(req, res, next) {
  if (req.session.username) {
    res.render('chat', { title: 'Chat Room' });
  } else {
    res.redirect('/');
  }
};
exports.userGetSignout = function(req, res, next) {
  console.log(req.session.username);
  req.session.username = null;
  res.redirect('/');
};
