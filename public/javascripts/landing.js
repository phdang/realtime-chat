$('input').on('keyup', function(event) {
  const cleanInput = input => {
    return $('<div/>')
      .text(input)
      .html();
  };
  if (event.keyCode === 13) {
    // console.log('enter');
    // console.log(event.target.value);
    //User hits enter
    username = cleanInput(event.target.value.trim());
    if (username) {
      $('.error-message').html('Đang kiểm tra...');
      $.ajax({
        method: 'POST',
        url: '/',
        data: { username: username },
        success: function(res) {
          $('.error-message').html(
            '<span style="color: #69F0AE;">Vào thành công</span>'
          );
          if (res.message === 'success') location.href = '/chat';
        },
        error: function(request, status, error) {
          $('.error-message').html(
            '<span style="color: #F44336;">' +
              request.responseJSON.message +
              '</span>'
          );
        }
      });
    }
  }
});
