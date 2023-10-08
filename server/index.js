const express = require("express");
const http = require("http");
const cors = require("cors");
const app = express();
const { Server } = require("socket.io");
const mongoose = require("mongoose");
const RoomModels = require("./models/Room");
require("dotenv").config();

app.use(cors());
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("mongodb connected!");
  } catch (err) {
    console.log(err);
  }
})();

app.get("/", (req, res) => {
  return res.json({ status: "OK!" });
});

let users = [];

io.on("connection", (socket) => {
  users.push(socket.id);
  socket.on("join_room", async (data) => {
    socket.join(data);
    const findData = await RoomModels.find({}).where("room").equals(data).exec();

    // kalau data sudah ada maka tampilkan.
    if (findData.length > 0) {
      // socket.to(data).emit("receive_message", findData[0]);
      socket.emit("receive_message", findData[0]);
    }

    console.log(`User ID ${socket.id} joined room ${data}`);
  });

  socket.on("send_message", async (data) => {
    const findData = await RoomModels.find({}).where("room").equals(data.room).exec();

    if (findData.length > 0) {
      const dataMessage = {
        author: data.author,
        message: data.message,
        time: data.time,
      };
      const newData = await RoomModels.updateOne(
        {
          room: data.room,
        },
        {
          $push: {
            message: dataMessage,
          },
        }
      );
      socket.to(data.room).emit("receive_message", newData);
    } else {
      const newData = await RoomModels.create({
        room: data.room,
        message: [
          {
            author: data.author,
            message: data.message,
            time: data.time,
          },
        ],
      });
      socket.to(data.room).emit("receive_message", newData);
    }
    // socket.to(data.room).emit("receive_message", data);
  });
  socket.on("disconnect", () => {
    users = users.filter((user) => user !== socket.id);
    socket.broadcast.emit("users", users.length);
    socket.emit("users", users.length);
  });
  socket.broadcast.emit("users", users.length);
  socket.emit("users", users.length);
});

server.listen(3001, () => {
  console.log("Server running on port 3001");
});
