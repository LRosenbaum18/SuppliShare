import React, { useState, useEffect } from 'react';
import ImageUploader from '../shared/ImageUploader/ImageUploader';
import { Link } from 'react-router-dom';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './Home.css';

const PostManagementView = () => {
const [selectedItem, setSelectedItem] = useState(null);
  const [items, setItems] = useState([]);
  const [showSortingOptions, setShowSortingOptions] = useState(false);
  {/*set items and show sorting options */}
  useEffect(() => {
	  {/*fetch the listings from api/listings */}
    fetchListings('http://localhost:5000/api/listings'); // Default listing fetch
  }, []);

const fetchListings = async (url) => {
  try {
	  {/*reponse awaut fetch url if response not okay throw a new error */}
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch listings');
    }
    const data = await response.json();
	{/*data await response json */}
    setItems(data.map(item => ({
      ...item,
      itempictureurl: item.imageurls && item.imageurls.length > 0 ? item.imageurls[0] : null // Get the first image URL
    })));
	{/*set items data map item, item picture url, image url length is greather than 0 and is also the first image, (preview image shown) */}
  } catch (error) {
	  {/*catch error and logged it with fetch listings error */}
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
	{/*sort url api call to listings/ sort / sortby / sorttype */}
  const sortUrl = `http://localhost:5000/api/listings/sort/${sortBy}/${sortType}`;
  try {
    const response = await fetch(sortUrl);
	{/*await reponse fetched sorted urls */}
    if (!response.ok) {
		{/*if reponse is not okay throw a new error */}
      throw new Error('Failed to fetch sorted listings');
    }
	{/*data await response json data log response json data */}
    const data = await response.json();
    console.log('Sorted data:', data); // Log the sorted data
    setItems(data.map(item => ({
      ...item,
      itempictureurl: item.imageurls && item.imageurls.length > 0 ? item.imageurls[0] : null // Get the first image URL
    })));
	{/*set item to itempicture url item imageurls and item image url is greater than 0 and is also the first in te array and is not null. */}
  } catch (error) { 
  {/*catch the error  */}
    console.error('Error fetching sorted listings:', error);
  }
};
   {/*handle the deleting of the information, post request with applicaiton in json format,  */}
  const handleDelete = async (listingId) => {
    try {
      const response = await fetch('http://localhost:5000/api/listings/delete', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ listingid: listingId })
      });
	  {/*if reponse not okay throw a new error failed to delete the listing  */}
      if (!response.ok) {
        throw new Error('Failed to delete listing');
      }
     
      fetchListings('http://localhost:5000/api/listings');
	  {/*fetch listings so that it refreshes and catch the error  log the eror  */}
    } catch (error) {
      console.error('Error deleting listing:', error);
    }
  };
  
  return (
  {/*upper section that is content moderation and the filter button. onClick handling with font awesome icons */}
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1 className='gradientText' style={{ fontSize: '1.5rem', fontFamily: 'Impact, fantasy' }}>
        Content moderation
        <span onClick={toggleSortingOptions} style={{ cursor: 'pointer', marginLeft: '20px' }}>
          Filter<FontAwesomeIcon icon={faFilter} />
        </span>
      </h1>
       {/*conditonal rendering of the showSortingOptions handling sorting for asc dateposted desc dateposted asc zipcode desc zipcode desc itemcategory asc itemcategory */}
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
      {/*image grid for the images being shown */}
      <div className="imageGrid" style={{ marginTop: '2%' }}>
        {items.map((item, index) => (
          <div key={index} style={{ outline: '1px inset black' }}>
		  {/*key the images within the image grid container */}
            <h3 className="titleContainer">{item.listingname}</h3>
			{/*display item listing name and a button to handle the deltion of the image */}
			<button  className="customButton" onClick={() => handleDelete(item.listingid)}>Delete</button>
            {item.itempictureurl && (
              <div className="imageItem" onClick={() => openModal(item)}> {/*when the button is being clicked it will ink the user to Home/listingname/listingid/username/zipcode/itemdescription/imageurl */}
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
				{/*set the state of each of those items so useParams can use it in when the image is being clicked*/}
                  <img src={cleanImageUrl(item.itempictureurl.trim())} alt={item.listingname} />
                </Link>
              </div>
            )}
          </div>
        ))}
      </div>
      {/*since imageuploader is used for image processing the showDropzone rendering will be made false so that section is not rendered, showing the images is set to false as well because the api call handles that */}
      <div style={{ marginTop: '20px' }}>
        <ImageUploader showDropzone={false} showImages={false} onTextSubmit={handleSubmittedData} />
      </div>
      {/*selected items potentially unused */}
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


export default PostManagementView;
