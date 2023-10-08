const mongoose = require("mongoose");

const RoomSchema = new mongoose.Schema({
  room: {
    type: String,
    required: true,
  },
  message: {
    type: Array,
    required: true,
  },
});

const RoomModels = mongoose.model("Rooms", RoomSchema);
module.exports = RoomModels;
