import React, { useState, useEffect, useRef } from 'react';
import { useMsal, useAccount } from '@azure/msal-react';

const Chat = ({recipient}) => {
	//*recipient being sent as a prop */}
    const [messages, setMessages] = useState([]);
    
    const ws = useRef(null);
    const messageInputRef = useRef(null);
    const { accounts } = useMsal();
    const account = useAccount(accounts[0] || {});
    //*messages, websocket messageinputreference, accounts with usemsal and useaccount */}
useEffect(() => {
    if (!account) {
        console.log('User is not authenticated');
        return;
		//*checking authentication */}
    }

    const userId = account.username;
	//*userid */}
    const connectWebSocket = async () => {
        const response = await fetch(`https://supplishare.azurewebsites.net/api/negotiate?user=${userId}`, {
            credentials: 'include',
        });
		//*websocket connection with api called to supplishare azure. */}
        const { url } = await response.json();
		//*url awaits response json */}
        //*web socket initalization open on message parse event data */}
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
    //*call to connect websocket */}
    connectWebSocket();

    return () => {
		//*if socket current. close the current socket.  */}
        if (ws.current) {
            ws.current.close();
        }
    };
}, [account]); // Include 'account' in the dependency array

    //*handling for sending a message */}
    const handleSendMessage = () => {
        const messageText = messageInputRef.current.value.trim();
		//*set message to messageinput reference to its current value and trim it */}
        if (ws.current && messageText !== '' && recipient!=='') {
            const message = {
                recipientUserId: recipient,
                message: messageText
            };
			//*send the message in json  */}
            ws.current.send(JSON.stringify(message)); // Send message as JSON

            // Add sent messages to state, tagging them accordingly
            setMessages((prevMessages) => [...prevMessages, { message: messageText, type: 'sent', recipientUserId: recipient }]);
            messageInputRef.current.value = '';
        }
    };

    return (
        <div>
            <h1>Chat with Donor: </h1>
			{/*chat with donor */}
            
           <div style={{ display: 'flex', alignItems: 'center' }}>
                <input
                    ref={messageInputRef}
                    type="text"
                    placeholder="Type your message..."
                    onKeyPress={(e) => e.charCode === 13 && handleSendMessage()} // Send on Enter
                />
			{/*handling for send message button included to send the message */}	
                <button style={{ marginRight: '50px' }} onClick={handleSendMessage}>Send</button>
            </div>
            <div id="messages">
			{/*map the messasges */}
                {messages.map((msg, index) => (
                    <p key={index} style={{
    wordWrap: 'break-word',
    overflowWrap: 'break-word',
	 padding: '15px'
  }} className={msg.type === 'received' ? "received" : "sent"}>
                        {msg.recipientUserId ? `[DM to ${msg.recipientUserId}] ` : ""}
                        {msg.message}
                    </p>
                ))}
            </div>
        </div>
    );
};

export default Chat;
