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
    fetchItems();
  }, []);

  const fetchItems = async (sortBy = '') => {
    try {
      let url = 'http://localhost:5000/items';
      if (sortBy) {
        url = `http://localhost:5000/items/sort/${sortBy}`;
      }
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch items');
      }
      const data = await response.json();
      setItems(data);
    } catch (error) {
      console.error('Error fetching items:', error);
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
    <div style={{ textAlign: 'center', marginTop: '50px'}}>
      <h1 style={{ color: '#f89033', fontSize: '1.5rem', fontFamily: 'Impact, fantasy' }}>
        Take a look at our items
        <span onClick={toggleSortingOptions} style={{ cursor: 'pointer', marginLeft: '20px' }}>
          Filter<FontAwesomeIcon icon={faFilter} />
        </span>
      </h1>

      {showSortingOptions && (
        <div style={{ marginTop: '2%' }}>
          <button className="customButton" onClick={() => fetchItems('zipcode/ascending')}>Sort by Zipcode (Asc)</button>
          <button className="customButton" onClick={() => fetchItems('zipcode/descending')}>Sort by Zipcode (Desc)</button>
          <button className="customButton" onClick={() => fetchItems('dateposted/ascending')}>Sort by Date Posted (Asc)</button>
          <button className="customButton" onClick={() => fetchItems('dateposted/descending')}>Sort by Date Posted (Desc)</button>
          <button className="customButton" onClick={() => fetchItems('itemcategory/ascending')}>Sort by Item Category (Asc)</button>
          <button className="customButton" onClick={() => fetchItems('itemcategory/descending')}>Sort by Item Category (Desc)</button>
        </div>
      )}

      <div className="imageGrid" style={{ marginTop: '2%' }}>
        {items.map((item, index) => (
          <div key={index}>
            <h3 className="titleContainer">{item.itemtype}</h3>
            <h2 className="titleContainer">{item.itemcategory}</h2>
            {item.itempictureurl.split(',').map((url, idx) => (
              <div key={idx} className="imageItem" onClick={() => openModal(item)}>
                <Link to={{
                  pathname: `/home/${item.itemtype}/${item.zipcode}/${item.description}/${encodeURIComponent(url)}`, // encode the URL parameter
                  state: { itemtype: item.itemtype, zipcode: item.zipcode, description: item.description, itempictureurl: url }
                }}>
                  <img src={cleanImageUrl(url.trim())} alt={item.itemtype} />
                </Link>
              </div>
            ))}
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
            <h2 className="PopUpTitle">Title: {selectedItem.itemtype}</h2>
            <p>Description: {selectedItem.description}</p>
            <p>Zipcode: {selectedItem.zipcode}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;