import { useEffect, useState } from "react";
import "./App.css";
import io from "socket.io-client";
import Chat from "./Components/Chat";

const socket = io.connect("http://localhost:3001");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [user, setUser] = useState(0);

  const joinRoom = () => {
    if (username !== "" && room !== "" && username !== "admin") {
      setShowChat(true);
      if (username == "makanbakso") setUsername("admin");
      return socket.emit("join_room", room);
    }
    alert("error!");
  };

  useEffect(() => {
    socket.on("users", (data) => {
      setUser(data);
    });
  }, [socket]);
  return (
    <div className="App">
      {!showChat ? (
        <div className="joinChatContainer">
          <h3>Join A Chat</h3>
          <p>{user} users online!</p>
          <p>Global room ID = global</p>
          <input type="text" placeholder="John.." onChange={(e) => setUsername(e.target.value)} />
          <input type="text" placeholder="Room ID.." onChange={(e) => setRoom(e.target.value)} />
          <button onClick={joinRoom}>Join A Room</button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} user={user} />
      )}
    </div>
  );
}

export default App;
