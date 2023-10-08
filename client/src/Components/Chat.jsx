import React, { useEffect, useState } from "react";

export default function Chat({ socket, username, room, user }) {
  const [currentMessage, setCurrentMessage] = useState("");
  const [messageList, setMessageList] = useState([]);

  const handleSubmit = async (e) => {
    if (currentMessage !== "") {
      const messageData = {
        room,
        author: username,
        message: currentMessage,
        time: new Date(Date.now()).getHours() + ":" + new Date(Date.now()).getMinutes(),
      };
      await socket.emit("send_message", messageData);
      setMessageList((list) => [...list, messageData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    return () => {
      socket.on("receive_message", async (messageData) => {
        await messageData.message.map((data) => {
          setMessageList((list) => [...list, data]);
        });
      });
    };
  }, [socket]);
  return (
    <div className="chat-window">
      <p>{user} users online!</p>
      <div className="chat-header">
        <p>live chat</p>
      </div>
      <div className="chat-body">
        {messageList.map((messageContent, id) => {
          return (
            <div className="message" key={id} id={username === messageContent.author ? "you" : "other"}>
              <div className="">
                <span style={{ display: "block" }} id={username === messageContent.author ? "you" : "other"}>
                  <b>{messageContent.author}</b>
                </span>
                <div className="message-content">
                  <p>{messageContent.message}</p>
                </div>
                <div className="message-meta">
                  <p>{messageContent.time}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="chat-footer">
        <input type="text" placeholder="message.." onChange={(e) => setCurrentMessage(e.target.value)} value={currentMessage} />
        <button onClick={handleSubmit}>&#9658;</button>
      </div>
    </div>
  );
}
