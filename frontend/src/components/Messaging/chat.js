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

        const connectWebSocket = async () => {
            // Assume username is unique and used as userID
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
        return () => {
            if (ws.current) {
                ws.current.close();
            }
        };
    }, [account]);

    const handleSendMessage = () => {
        if (ws.current && messageInputRef.current.value.trim() !== '') {
            const message = {
                recipientUserId: recipient,
                message: messageInputRef.current.value
            };
            ws.current.send(JSON.stringify(message));
            messageInputRef.current.value = '';
        }
    };

    return (
        <div>
            <h1>Serverless Chat App</h1>
            <div>
                <input
                    type="text"
                    placeholder="Recipient User ID"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                />
            </div>
            <div>
                <input
                    ref={messageInputRef}
                    type="text"
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.charCode === 13 && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>Send</button>
            </div>
            <div id="messages">
                {messages.map((message, index) => (
                    <p key={index}>{message}</p>
                ))}
            </div>
        </div>
    );
};

export default Chat;
