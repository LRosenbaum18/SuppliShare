import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal, useAccount  } from "@azure/msal-react";
import ChatPopup from './chatpopup.js';
import './Home.css';

const PostDetails = () => {
  const { listingname, listingid, username, zipcode, description, itempictureurl } = useParams();
  console.log('Individual parameters:', listingname, listingid, zipcode, description, itempictureurl);
  const navigate = useNavigate();
  const cleanImageUrl = (url) => {
    return url.replace(/"/g, ''); // Remove %22 (")
  };
    const [imageUrls, setImageUrls] = useState([]);

  const cleanedItemPictureUrl = cleanImageUrl(itempictureurl);
  const [showChatPopup, setShowChatPopup] = useState(false);

  const toggleChatPopup = () => {
    setShowChatPopup(!showChatPopup);
  };
  
  const { accounts } = useMsal(); // Get MSAL accounts
  const account = useAccount(accounts[0] || {}); // Get the first account
  const msalUserName = account?.username || ""; // Get the MSAL username

  // Check if the MSAL username matches the username from useParams
  const isSameUser = msalUserName === username;
  console.log('MSAL Username:', msalUserName);
console.log('Username from useParams:', username);
console.log('isSameUser:', isSameUser);
  const handleDelete = async (listingId) => {
    try {
      const response = await fetch('http://localhost:5000/api/listings/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ listingid: listingId })
      });
      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }
      // Navigate to home page after deletion
      navigate("/");
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };
  
    useEffect(() => {
    const fetchImages = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/listings/postimages/${listingid}`);
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        setImageUrls(data);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    };
    fetchImages();
  }, [listingid]);
  return (
  <>
    <AuthenticatedTemplate>
	
      <div className="post-details-container">
	  
        <div className="Box"></div>
        <div className="post-details-content">
		{isSameUser && (
            <p>
              <button  className="customButton" onClick={() => handleDelete(listingid)}>Delete your post</button>
            </p>
          )}
          <p className='titleContainer'>listingName: {listingname}</p>
          
		  {imageUrls.length > 0 && (
  <div className="detailsPic" style={{ display: 'flex' }}>
    {imageUrls.map((imageUrl, index) => (
      <img key={index} src={imageUrl} alt="Not found" style={{ marginRight: '10px' }} />
    ))}
  </div>
)}
          <table className='TableProp'>
            <thead>
              <tr>
                <th className="titleContainer">Item Details</th>
                <th className="titleContainerright"></th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="titleContainer">Description: </td>
                <td className="titleContainerright">{description}</td>
              </tr>
              <tr>
                <td className="titleContainer">Zipcode: </td>
                <td className="titleContainerright">{zipcode}</td>
              </tr>
              <tr>
                <td className="titleContainer">Listing ID: </td>
                <td className="titleContainerright">{listingid}</td>
              </tr>
              
            </tbody>
          </table>
          <p>
            <button className="customButton" onClick={toggleChatPopup}>Click here to chat</button>
          </p>
          {showChatPopup && (
            <ChatPopup
              onClose={toggleChatPopup}
              itemtype={listingname}
              description={description}
              itempictureurl={itempictureurl}
			  recipient={username}
            />
          )}
        </div>
      </div>
    </AuthenticatedTemplate>
    <UnauthenticatedTemplate>
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
              
            </tbody>
          </table>
        </div>
      </div>
    </UnauthenticatedTemplate>
  </>
);

};

export default PostDetails;
