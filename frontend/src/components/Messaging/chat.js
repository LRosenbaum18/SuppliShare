import React, { useState, useEffect, useRef } from 'react';
import { useMsal, useAccount } from '@azure/msal-react';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [recipient, setRecipient] = useState('');
    const ws = useRef(null);
    const messageInputRef = useRef(null);
    const { accounts } = useMsal();
    const account = useAccount(accounts[0] || {});

useEffect(() => {
    if (!account) {
        console.log('User is not authenticated');
        return;
    }

    const userId = account.username;
    const connectWebSocket = async () => {
        const response = await fetch(`https://supplishare.azurewebsites.net/api/negotiate?user=${userId}`, {
            credentials: 'include',
        });
        const { url } = await response.json();

        ws.current = new WebSocket(url);
        ws.current.onopen = () => console.log('WebSocket connected');
        ws.current.onmessage = (event) => {
            const eventData = JSON.parse(event.data);
            // Add received messages to state, tagging them as 'received'
            setMessages((prevMessages) => [...prevMessages, { ...eventData, type: 'received' }]);
        };
        ws.current.onclose = () => console.log('WebSocket disconnected');
        ws.current.onerror = (error) => console.error('WebSocket error:', error);
    };

    connectWebSocket();

    return () => {
        if (ws.current) {
            ws.current.close();
        }
    };
}, [account]); // Include 'account' in the dependency array


    const handleSendMessage = () => {
        const messageText = messageInputRef.current.value.trim();
        if (ws.current && messageText !== '') {
            const message = {
                recipientUserId: recipient,
                message: messageText
            };
            ws.current.send(JSON.stringify(message)); // Send message as JSON

            // Add sent messages to state, tagging them accordingly
            setMessages((prevMessages) => [...prevMessages, { message: messageText, type: 'sent', recipientUserId: recipient }]);
            messageInputRef.current.value = '';
        }
    };

    return (
        <div>
            <h1>Chat with User: </h1>
            
           <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    ref={messageInputRef}
                    type="text"
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.charCode === 13 && handleSendMessage()} // Send on Enter
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
            <div id="messages">
                {messages.map((msg, index) => (
                    <p key={index} className={msg.type === 'received' ? "received" : "sent"}>
                        {msg.recipientUserId ? `[DM to ${msg.recipientUserId}] ` : ""}
                        {msg.message}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default Chat;
