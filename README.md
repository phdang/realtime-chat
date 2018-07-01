# realtime-chat

Cùng tạo kênh chat một cách đơn giản với nodeJs, Express, MongoDB và Socket IO

## Bắt đầu

Project này chỉ nhằm mục đích giới thiệu cho mọi người với ứng dụng realtime của Socket IO cũng như dần làm quen với các event
và những điểm mạnh mà package này đem lại cho chúng ta

![Realtime Chat](https://github.com/phdang/realtime-chat/blob/master/public/images/demo1.png)
![Realtime Chat](https://github.com/phdang/realtime-chat/blob/master/public/images/demo2.png)

### Kiến thức cần biết

nodeJs, mongoDB và Javascript cơ bản.
Kiểm tra xem máy đã cài đặt node

```
npm -v
```

### Cài đặt

Đầu tiên sau khi clone về các bạn chạy lệnh

```
npm install
```

Sau đó cài đặt mongoDB và đưa đường dẫn vào hằng process.env.MONGO_CONNECT lần lượt trong các file

```
realtime/routes/index.js
```

```
realtime/controllers/user.js
```

hoặc tạo env varibale bằng cách tạo thêm thư mục config/keys/ rồi lưu hết các secret vào đó. Sau khi config kết nối với mongoDB tiếp tục chạy lệnh

```
npm start
```

Lưu ý server chạy trên port mặc định sẽ là 6069 nếu trong trường hợp trùng port, các bạn vào thư mục

```
realtime/bin/www
```

để thay đổi lại port cho phù hợp

## Chạy thử

Project đang được chạy thử trên heroku các bạn có thể vào đường dẫn sau để xem demo trực tiếp

```
[Realtime Chat](https://secret-forest-78336.herokuapp.com/)
```

## Được xây dựng từ

- nodeJs
- express generator
- Ejs templating engine
- Mongoose
- Socket IO
