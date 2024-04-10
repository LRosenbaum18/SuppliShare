import React, { useState, useEffect } from 'react';
import ImageUploader from '../shared/ImageUploader/ImageUploader';

import '../shared/ImageUploader/ImageUploader.css';
import { Link } from 'react-router-dom';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Home.css';

const Home = () => {
  const [selectedItem, setSelectedItem] = useState(null);
  const [submittedData, setSubmittedData] = useState({ title: '', description: '' });
  const [items, setItems] = useState([]);
  const [showSortingOptions, setShowSortingOptions] = useState(false);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/listings');
      if (!response.ok) {
        throw new Error('Failed to fetch listings');
      }
      const data = await response.json();
      // Map the data to include the image URL from supplishare.imageurl
      const updatedData = data.map(item => ({
        ...item,
        itempictureurl: item.imageurls[0], // Assuming the image URLs are stored in the 'imageurls' property
        listingname: item.listingname // Change itemType to listingname
		
      }));
      setItems(updatedData);
	  console.log('set items', setItems);
	  console.log('updated Data', updatedData);
    } catch (error) {
      console.error('Error fetching listings:', error);
    }
  };

  const handleSubmittedData = (data) => {
    setSubmittedData(data);
    console.log("data submitted handlesubmitted", submittedData);
  };

  const openModal = (item) => {
    setSelectedItem(item);
  };

  const closeModal = () => {
    setSelectedItem(null);
  };

  const cleanImageUrl = (url) => {
    return url.replace(/"/g, ''); // Remove %22 (")
  };

  const toggleSortingOptions = () => {
    setShowSortingOptions(!showSortingOptions);
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 className='gradientText' style={{ fontSize: '1.5rem', fontFamily: 'Impact, fantasy' }}>
        Take a look at our items
        <span onClick={toggleSortingOptions} style={{ cursor: 'pointer', marginLeft: '20px' }}>
          Filter<FontAwesomeIcon icon={faFilter} />
        </span>
      </h1>

      {showSortingOptions && (
        <div style={{ marginTop: '2%' }}>
          <button className="customButton" onClick={() => fetchListings('zipcode/ascending')}>Sort by Zipcode (Asc)</button>
          <button className="customButton" onClick={() => fetchListings('zipcode/descending')}>Sort by Zipcode (Desc)</button>
          <button className="customButton" onClick={() => fetchListings('dateposted/ascending')}>Sort by Date Posted (Asc)</button>
          <button className="customButton" onClick={() => fetchListings('dateposted/descending')}>Sort by Date Posted (Desc)</button>
          <button className="customButton" onClick={() => fetchListings('itemcategory/ascending')}>Sort by Item Category (Asc)</button>
          <button className="customButton" onClick={() => fetchListings('itemcategory/descending')}>Sort by Item Category (Desc)</button>
        </div>
      )}

      <div className="imageGrid" style={{ marginTop: '2%' }}>
        {items.map((item, index) => (
          <div key={index}>
            <h3 className="titleContainer">{item.listingname}</h3>
            <h2 className="titleContainer">{item.itemcategory}</h2>
			<p>Listing ID: {item.listingid}</p> {/* Display listingID */}
            <p>Username: {item.username}</p> {/* Display username */}
            {item.itempictureurl && (
              <div className="imageItem" onClick={() => setSelectedItem(item)}>
                <Link to={{
                  pathname: `/home/${item.listingname}/${item.zipcode}/${item.description}/${encodeURIComponent(item.itempictureurl)}`, // encode the URL parameter
                  state: { itemtype: item.listingname, zipcode: item.zipcode, description: item.description, itempictureurl: item.itempictureurl }
                }}>
                  <img src={cleanImageUrl(item.itempictureurl.trim())} alt={item.listingname} />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '20px' }}>
        <ImageUploader showDropzone={false} showImages={false} onTextSubmit={handleSubmittedData} />
      </div>

      {selectedItem && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close" onClick={closeModal}>&times;</span>
            <h2 className="PopUpTitle">Title: {selectedItem.listingname}</h2>
            <p>Description: {selectedItem.description}</p>
            <p>Zipcode: {selectedItem.zipcode}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
