import React, { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import ChatPopup from './chatpopup.js';

const PostDetails = () => {
  const { itemtype, zipcode, description, itempictureurl } = useParams();
  console.log('Individual parameters:', itemtype, zipcode, description, itempictureurl);

  const location = useLocation();
  console.log('Location state:', location.state);
  const cleanImageUrl = (url) => {
    return url.replace(/"/g, ''); // Remove %22 (")
  };

  const cleanedItemPictureUrl = cleanImageUrl(itempictureurl);
  const [showChatPopup, setShowChatPopup] = useState(false);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    fetchListings();
  }, []);

async function fetchListings() {
  try {
    const response = await fetch('/api/listings');
    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }
    const body = await response.text(); // Get the response body as text
    console.log('Response body:', body);
    console.log('Response body:', data);	// Log the response body
    const data = JSON.parse(body); // Parse the response body as JSON
    setListings(data); // Update the listings state with the fetched data
  } catch (error) {
    console.error('Could not fetch listings:', error);
  }
}

  const toggleChatPopup = () => {
    setShowChatPopup(!showChatPopup);
  };

  return (
    <div className="post-details-container">
      <div className="Box"></div>
      <div className="post-details-content">
        <p className='Title'>Item Type: {itemtype}</p>
        {itempictureurl && (
          <div className="detailsPic">
            <img src={cleanedItemPictureUrl} alt={itemtype} />
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
          </tbody>
        </table>
        <p><button className="customButton" onClick={toggleChatPopup}>Click here to chat</button></p>
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
