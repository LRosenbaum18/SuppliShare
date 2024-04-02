import React, { useState, useEffect, useRef } from 'react';
import { useMsal, useAccount } from '@azure/msal-react';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const ws = useRef(null);
  const messageInputRef = useRef(null);
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  useEffect(() => {
    if (!account) {
      console.log('User is not authenticated');
      return;
    }

    const connectWebSocket = async () => {
      // Use the account's username or other unique identifier as needed
      const userId = account.username;

      const response = await fetch(`https://supplishare.azurewebsites.net/api/negotiate?user=${userId}`, {
        credentials: 'include',
      });
      const { url } = await response.json();

      ws.current = new WebSocket(url);
      ws.current.onopen = () => console.log('WebSocket connected');
      ws.current.onmessage = (event) => {
        setMessages((prevMessages) => [...prevMessages, event.data]);
      };
      ws.current.onclose = () => console.log('WebSocket disconnected');
      ws.current.onerror = (error) => console.error('WebSocket error:', error);
    };

    connectWebSocket();
  }, [account]);

  const handleKeyPress = (e) => {
    if (e.charCode === 13 && ws.current) { // Enter key
      ws.current.send(messageInputRef.current.value);
      messageInputRef.current.value = '';
    }
  };

  if (!account) {
    return <div>Please sign in to use the chat.</div>;
  }

  return (
    <div>
      <h1>Serverless Chat App</h1>
      <input
        ref={messageInputRef}
        type="text"
        id="message"
        placeholder="Type to chat..."
        onKeyPress={handleKeyPress}
      />
      <div id="messages">
        {messages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}
      </div>
    </div>
  );
};

export default Chat;
