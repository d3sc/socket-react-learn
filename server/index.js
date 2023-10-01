const app = require("express")();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

app.use(cors());

// menggunakan http, karena jika kita menggunakan web socket, katanya harus menggunakan http server, walaupun udh pake express
const server = http.createServer(app);

// setting server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

//* kita harus menambahkan io.on("connection"), artinya pada saat user membuka website maka akan menjalankan callback
// dengan kata lain pada saat user membuka website, maka akan langsung menjalankan function callback
io.on("connection", (socket) => {
  //* jika ada emit yang dikirim, maka akan ditangkap oleh on, sesuai nama emit nya.
  // harus menggunakan socket, bukan io.
  // socket.on("send_message", (data) => {
  //   // broadcast digunakan untuk mengirim ke semua orang, kecuali ke orang yang mengirim sendiri, dia ngak kena broadcast nya.
  //   socket.broadcast.emit("receive_message", data);
  // });

  socket.on("join_room", (data) => {
    // memasukkan client kedalam room yang nantinya akan bisa menerima/melihat pesan secara spesifik ketika sudah join ke room.
    //* yang bisa melihat pesan hanya client yang sudah masuk kedalam room saja
    socket.join(data.room);
    // mengirim code_room sesuai data
    socket.emit("code_room", data.room);
  });

  socket.on("send_message", (data) => {
    // client akan mengirim pesan secara spesifik ke room yang ditentukan.
    // yang bisa melihat pesan hanya client yang sudah masuk kedalam room saja
    socket.to(data.codeRoom).emit("receive_message", data);

    // membuat client melihat pesan yang dia kirim sendiri.
    socket.emit("receive_message", data);
  });
});

server.listen(3001, () => {
  console.log("Server Is Running at " + 3001);
});
