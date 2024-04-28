import React from 'react';
import Chat from '../Messaging/chat';

import './chatpopup.css';

const ChatPopup = ({ onClose, itemtype, itempictureurl, recipient }) => {
{/* chat popup recieves, onClose, Itemtype, itempictureurl, recipient, chatpopup css is the import used and chat component*/}

  

  // Fetch the username from the authentication system or user context



  return (
  {/* div with class name chatpopup */}
    <div className="chat-popup">
      <div className="chat-header">
	  {/*sourcing the image with itempicture url taken from the db, alt name is the title/itemtype of the image */}
        <img src={itempictureurl} alt={itemtype} className="chat-image" />
        <h3 className="chat-title">{itemtype}</h3>
		{/* className chat title, with the itemtype being displayed */}
        <button  onClick={onClose} className="chat-close-button">Close</button>
		{/* button onClose, with the className-chat-close-button used to handlign when the closed button is clicked */}
      </div>
     {/* div with the chat footer */}
      <div className="chat-footer">
      
      </div>

      <div className="chat-container">
	  {/*chat container */}
        <Chat recipient={recipient} />
		{/*call to chat component sending recipient as a prop */}
      </div>
    </div>
  );
};

export default ChatPopup;
