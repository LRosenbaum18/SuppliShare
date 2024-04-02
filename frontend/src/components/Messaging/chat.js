import React, { useState, useEffect, useRef } from "react";
import { WebPubSubClient } from "@azure/web-pubsub-client";

function UserChat({ from, message }) {
  return (
    <div className="align-self-start">
      <small className="text-muted font-weight-light">from {from}</small>
      <p className="alert alert-primary text-break">{message}</p>
    </div>
  );
}

function SelfChat({ message }) {
  return <div className="align-self-end alert-success alert">{message}</div>;
}

function Chat() {
  const [user, setUser] = useState("");
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState("");
  const [client, setClient] = useState(null);
  const endOfMessagesRef = useRef(null);

  async function initiateConnection() {
    if (!user.trim()) {
      setError("Username cannot be empty.");
      return;
    }
  
    try {
      const response = await fetch(
        `https://supplishare.azurewebsites.net/api/negotiate?userId=${encodeURIComponent(user)}`,
        { method: "POST" }
      );
      
      if (!response.ok) {
        throw new Error(`Negotiation failed: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      const newClient = new WebPubSubClient({ getClientAccessUrl: () => Promise.resolve(data.url) });
      
      newClient.on("group-message", (e) => {
        const data = JSON.parse(e.message.data);
        appendMessage(data);
      });
      
      await newClient.start();
      await newClient.joinGroup("chat");
      setConnected(true);
      setClient(newClient);
      setError(""); // Clear any existing errors
      
    } catch (error) {
      setError("Failed to connect. Please check the console for more details.");
      console.error("Connection failed:", error);
    }
  }
  

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chats]);

  async function send() {
    const chatMessage = JSON.stringify({
      from: user,
      message: message,
    });
    try {
      await client.sendToGroup("chat", chatMessage, "json", { noEcho: true });
      appendMessage({ from: user, message });
      setMessage(""); // Clear input after sending
    } catch (error) {
      setError("Failed to send message.");
      console.error("Send message failed:", error);
    }
  }

  function appendMessage(data) {
    setChats((prev) => [...prev, data]);
  }

  return (
    <div className="h-100 container">
      {!connected && (
        <div className="d-flex h-100 flex-column justify-content-center container">
          <div className="input-group m-3">
            <input
              autoFocus
              type="text"
              className="form-control"
              placeholder="Username"
              value={user}
              onChange={(e) => setUser(e.target.value)}
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                type="button"
                onClick={initiateConnection} // Use the initiateConnection function here
                disabled={!user}
              >
                Connect
              </button>
            </div>
          </div>
        </div>
      )}
      {connected && (
        <>
          <div className="chats d-flex flex-column m-2 p-2 bg-light h-100 overflow-auto">
            {chats.map((item, index) =>
              item.from === user ? (
                <SelfChat key={index} message={item.message} />
              ) : (
                <UserChat key={index} from={item.from} message={item.message} />
              )
            )}
            <div ref={endOfMessagesRef} />
          </div>
          {error && <div className="alert alert-danger">{error}</div>}
          <div className="input-group m-3">
            <input
              type="text"
              className="form-control"
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <div className="input-group-append">
              <button
                className="btn btn-primary"
                type="button"
                onClick={send}
                disabled={!message || !client}
              >
                Send
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Chat;
