import React, { useState, useEffect } from 'react';
import Chat from '../Messaging/chat';
import { useMsal, useAccount } from '@azure/msal-react';
import './chatpopup.css';

const ChatPopup = ({ onClose, itemtype, itempictureurl }) => {
  const [sender, setSender] = useState('');
  const [recipient, setRecipient] = useState('');
  const { accounts } = useMsal();
  const account = useAccount(accounts[0] || {});

  // Fetch the username from the authentication system or user context
  useEffect(() => {
    if (account) {
      setSender(account.username);
    }
  }, [account]);

  const handleRecipientChange = (e) => {
    setSender(e.target.value);
  };

  return (
    <div className="chat-popup">
      <div className="chat-header">
        <img src={itempictureurl} alt={itemtype} className="chat-image" />
        <h3 className="chat-title">{itemtype}</h3>
		<button onClick={onClose} className="chat-close-button">Close</button>
      </div>
      
      <div className="chat-footer">
        {/* sender input field */}
        
      </div>
      <Chat sender={sender} recipient={recipient} />
      
    </div>
  );
};

export default ChatPopup;
