import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";

const socket = io.connect("http://localhost:3001");

function App() {
  //! Kesimpulan :
  //* socket.emit() digunakan untuk mengirim signal/emit yang nantinya akan ditangkap oleh socket.on().
  //* socket.on() digunakan untuk menangkap signal/emit yang telah dikirim oleh socket.emit()

  // Room State
  const [room, setRoom] = useState("");
  const [codeRoom, setCodeRoom] = useState("");

  // Message State
  const [message, setMessage] = useState("");
  const [messageReceive, setMessageReceive] = useState("");

  const joinRoom = () => {
    if (room !== "") {
      return socket.emit("join_room", { room });
    }
    alert("code room tidak boleh kosong!");
  };

  const sendMessage = () => {
    // codeRoom didapatkan ketika user sudah menekan tombol join room.
    if (codeRoom !== "") {
      // emit digunakan untuk membuat event, yang nanti nya akan di listen/di tangkap di server.
      return socket.emit("send_message", { message, codeRoom });
    }
    alert("masukan code room!");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessageReceive(data.message);
    });

    // menangkap emit code_room
    socket.on("code_room", (data) => {
      // membuat code room
      setCodeRoom(data);
    });
  }, [socket]);
  return (
    <div className="app">
      <input type="text" placeholder="Code Room" onChange={(event) => setRoom(event.target.value)} />
      <button onClick={joinRoom}>join room</button>
      <input type="text" placeholder="Message.." onChange={(event) => setMessage(event.target.value)} />
      <button onClick={sendMessage}>Send Message</button>
      <h1>Code Room: {codeRoom}</h1>
      <h1>Message:</h1>
      {messageReceive}
    </div>
  );
}

export default App;
