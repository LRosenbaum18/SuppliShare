import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ChatPopup from './chatpopup.js';

const PostDetails = () => {
  const { listingname, listingid, username, zipcode, description, itempictureurl } = useParams();
  console.log('Individual parameters:', listingname, listingid, zipcode, description, itempictureurl);

  const location = useLocation();
  console.log('Location state:', location.state);
  const cleanImageUrl = (url) => {
    return url.replace(/"/g, ''); // Remove %22 (")
  };

  const cleanedItemPictureUrl = cleanImageUrl(itempictureurl);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [listings, setListings] = useState([]);



  const toggleChatPopup = () => {
    setShowChatPopup(!showChatPopup);
  };

  return (
    <div className="post-details-container">
      <div className="Box"></div>
      <div className="post-details-content">
        <p className='Title'>listingName: {listingname}</p>
        {itempictureurl && (
          <div className="detailsPic">
            <img src={cleanedItemPictureUrl} alt={listingname} />
          </div>
        )}
        <table className='TableProp'>
          <thead>
            <tr>
              <th>Item Details</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Description: </td>
              <td>{description}</td>
            </tr>
            <tr>
              <td>Zipcode: </td>
              <td>{zipcode}</td>
            </tr>
			<tr>
              <td>Listing ID: </td>
              <td>{listingid}</td>
            </tr>
            <tr>
              <td>Username: </td>
              <td>{username}</td>
            </tr>
          </tbody>
        </table>
        <p><button className="customButton" onClick={toggleChatPopup}>Click here to chat</button></p>
        {showChatPopup && (
          <ChatPopup
            onClose={toggleChatPopup}
            itemtype={listingname}
            description={description}
            itempictureurl={itempictureurl}
          />
        )}
      </div>
    </div>
  );
};

export default PostDetails;
