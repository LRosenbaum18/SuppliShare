import React, { useState, useEffect } from 'react';
import ImageUploader from '../shared/ImageUploader/ImageUploader';
import { Link } from 'react-router-dom';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Home.css';

const Home = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const [items, setItems] = useState([]);
  const [showSortingOptions, setShowSortingOptions] = useState(false);

  useEffect(() => {
    fetchListings('http://localhost:5000/api/listings'); // Default listing fetch
  }, []);

const fetchListings = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }
    const data = await response.json();
    setItems(data.map(item => ({
      ...item,
      itempictureurl: item.imageurls && item.imageurls.length > 0 ? item.imageurls[0] : null // Get the first image URL
    })));
  } catch (error) {
    console.error('Error fetching listings:', error);
  }
};

  const handleSubmittedData = (data) => {
    
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

  // Function to handle sorting and fetching sorted listings
const handleSort = async (sortType, sortBy) => {
  const sortUrl = `http://localhost:5000/api/listings/sort/${sortBy}/${sortType}`;
  try {
    const response = await fetch(sortUrl);
    if (!response.ok) {
      throw new Error('Failed to fetch sorted listings');
    }
    const data = await response.json();
    console.log('Sorted data:', data); // Log the sorted data
    setItems(data.map(item => ({
      ...item,
      itempictureurl: item.imageurls && item.imageurls.length > 0 ? item.imageurls[0] : null // Get the first image URL
    })));
  } catch (error) {
    console.error('Error fetching sorted listings:', error);
  }
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
          <button className="customButton" onClick={() => handleSort('asc', 'dateposted')}>
  Sort by Date Posted (Asc)
</button>

<button className="customButton" onClick={() => handleSort('desc', 'dateposted')}>
  Sort by Date Posted (Desc)
</button>
<button className="customButton" onClick={() => handleSort('asc', 'zipcode')}>
  Sort by Zipcode (Asc)
</button>

<button className="customButton" onClick={() => handleSort('desc', 'zipcode')}>
  Sort by Zipcode (Desc)
</button>
<button className="customButton" onClick={() => handleSort('asc', 'itemcategory')}>
  Sort by itemcategory (asc)
</button>
<button className="customButton" onClick={() => handleSort('desc', 'itemcategory')}>
  Sort by itemcategory (Desc)
</button>
		  
        </div>
      )}

      <div className="imageGrid" style={{ marginTop: '2%' }}>
        {items.map((item, index) => (
          <div key={index} style={{ outline: '1px inset black' }}>
            <h3 className="titleContainer">{item.listingname}</h3>
            {item.itempictureurl && (
              <div className="imageItem" onClick={() => openModal(item)}>
                <Link
                  to={{
                    pathname: `/home/${item.listingname}/${item.listingid}/${item.username}/${item.zipcode}/${item.description}/${encodeURIComponent(item.itempictureurl)}`,
                    state: {
                      listingname: item.listingname,
                      listingid: item.listingid,
                      username: item.username,
                      zipcode: item.zipcode,
                      description: item.description,
                      itempictureurl: item.itempictureurl
                    }
                  }}
                >
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
