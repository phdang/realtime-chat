$(function() {
  var socket = io();
  if (
    navigator.platform == 'iPad' ||
    navigator.platform == 'iPhone' ||
    navigator.platform == 'iPod' ||
    navigator.platform == 'Linux armv6l'
  ) {
    $('form button').css({ position: 'relative', bottom: '-3px', left: '0' });
  }
  socket.emit('join room', { username: username });
  socket.on('join room', function(msg) {
    $('#users').html('');
    for (let user of msg.users) {
      $('#users').append(
        '<li><div class="user-name"><strong>' +
          user +
          '</strong></div><div class="user-status-on"></div></li>'
      );
    }
    var sndJoin = new Audio('/audio/filling-your-inbox.mp3'); // buffers automatically when created
    sndJoin.play();
    $('.join-room-msg').html(msg.message);
    setTimeout(function() {
      if (msg.onlineUsers > 2) {
        $('.join-room-msg').html('Số người đang online: ' + msg.onlineUsers);
      } else if (msg.onlineUsers == 2) {
        $('.join-room-msg').html(
          'Đã có người vào chat chung với bạn. Hãy làm quen nhau đi nào :D'
        );
      } else {
        $('.join-room-msg').html('Phòng chat này chỉ có mình bạn :((');
      }
    }, 3000);
  });
  socket.on('left room', function(msg) {
    var userleftElement = $('#users > li')[msg.indexUserLeft];
    var statusElement = $(userleftElement).find('.user-status-on')[0];
    statusElement.classList.remove('user-status-on');
    statusElement.classList.add('user-status-off');
    var sndLeft = new Audio('/audio/stopRecording.mp3'); // buffers automatically when created
    sndLeft.play();
    $('.join-room-msg').html(msg.message);
    setTimeout(function() {
      if (msg.onlineUsers > 1) {
        $('.join-room-msg').html('Số người đang online: ' + msg.onlineUsers);
      } else {
        $('.join-room-msg').html('Phòng chat này chỉ còn lại mình bạn :((');
      }
    }, 3000);
  });
  // detect enter or shift enter if enter submit form else break line for textarea;
  function getCaret(el) {
    if (el.selectionStart) {
      return el.selectionStart;
    } else if (document.selection) {
      el.focus();
      var r = document.selection.createRange();
      if (r == null) {
        return 0;
      }
      var re = el.createTextRange(),
        rc = re.duplicate();
      re.moveToBookmark(r.getBookmark());
      rc.setEndPoint('EndToStart', re);
      return rc.text.length;
    }
    return 0;
  }

  $('textarea').keyup(function(event) {
    if (event.keyCode == 13) {
      var content = this.value;
      var caret = getCaret(this);
      //if shift enter
      if (event.shiftKey) {
        this.value =
          content.substring(0, caret - 1) +
          '\n' +
          content.substring(caret, content.length);
        event.stopPropagation();
        //if enter
      } else {
        this.value =
          content.substring(0, caret - 1) +
          content.substring(caret, content.length);
        if (!username) {
          location.reload();
        }
        $('form').submit();
      }
    }
  });
  $('form').submit(function() {
    socket.emit('chat message', { username: username, message: $('#m').val() });
    $('#m').val('');
    return false;
  });
  socket.on('chat message', function(msg) {
    var auth = $('<li class="auth">').html(
      '<p class="message-username">' +
        msg.username +
        ': ' +
        '</p>' +
        '<p class="message-content">' +
        msg.message +
        '</p>'
    );
    var others = $('<li class="others">').html(
      '<p class="message-username">' +
        msg.username +
        ': ' +
        '</p>' +
        '<p class="message-content">' +
        msg.message +
        '</p>'
    );
    if (msg.message.trim() && msg.username) {
      if (msg.username === username) {
        var sndAuth = new Audio('/audio/shut-your-mouth.mp3'); // buffers automatically when created
        sndAuth.play();
        $('#messages').append(auth);
      } else {
        var sndOthers = new Audio('/audio/inquisitiveness.mp3'); // buffers automatically when created
        sndOthers.play();
        $('#messages').append(others);
      }
    } else {
      location.assign('/');
    }
    var scrollBottom = $(window).scrollTop() + $(window).height();
    $(window).scrollTop(scrollBottom);
  });
});
