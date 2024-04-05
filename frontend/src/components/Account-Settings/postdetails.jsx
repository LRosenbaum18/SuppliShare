import React, { useState } from 'react';
import { useLocation, useParams, Link } from 'react-router-dom';
import ChatPopup from './chatpopup.js';

const PostDetails = () => {
  // Extract parameters from the URL
  const { itemtype, zipcode, description, itempictureurl } = useParams();
  console.log('Individual parameters:', itemtype, zipcode, description, itempictureurl);

  // Get the location object to access the entire state
  const location = useLocation();
  console.log('Location state:', location.state);
  const cleanImageUrl = (url) => {
    return url.replace(/"/g, ''); // Remove %22 (")
  };

  // Clean the image URL
  const cleanedItemPictureUrl = cleanImageUrl(itempictureurl);
  const [showChatPopup, setShowChatPopup] = useState(false);

  const toggleChatPopup = () => {
    setShowChatPopup(!showChatPopup);
  };

  return (
    <div className="post-details-container">
      <div className="Box"></div>

      <div className="post-details-content" >
        <p className='Title'>Item Type: {itemtype}</p>
        {itempictureurl && (
          // <div className="imageItem">
          <div className="detailsPic">
            <img src={cleanedItemPictureUrl} alt={itemtype} />
          </div>
        )}
        <table className='TableProp'>
          <tr>
            <th>Item Details</th>
            <th></th>
          </tr>
          <tr>
            <td>Description: </td>
            {/* <td>{description}</td> Placeholder for description */}
            <td>{description}</td>
          </tr>
          <tr>
            <td>Zipcode: </td>
            <td>{zipcode}</td>
          </tr>
        </table>
        {/* <p>Details: {description}</p>
        <p className="zipcode-text">Zipcode: {zipcode}</p> */}
		 <p><button className="customButton" onClick={toggleChatPopup}>Click here to chat</button></p>
        
        {/* Render chat popup if showChatPopup is true */}
        {showChatPopup && (
          <ChatPopup
            onClose={toggleChatPopup}
            itemtype={itemtype}
            description={description}
            itempictureurl={itempictureurl}
          />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
