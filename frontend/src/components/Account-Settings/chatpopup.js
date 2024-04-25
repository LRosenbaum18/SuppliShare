import React from 'react';
import Chat from '../Messaging/chat';

import './chatpopup.css';

const ChatPopup = ({ onClose, itemtype, itempictureurl, recipient }) => {


  

  // Fetch the username from the authentication system or user context



  return (
    <div className="chat-popup">
      <div className="chat-header">
        <img src={itempictureurl} alt={itemtype} className="chat-image" />
        <h3 className="chat-title">{itemtype}</h3>
        <button  onClick={onClose} className="chat-close-button">Close</button>
      </div>

      <div className="chat-footer">
      
      </div>

      <div className="chat-container">
        <Chat recipient={recipient} />
      </div>
    </div>
  );
};

export default ChatPopup;
