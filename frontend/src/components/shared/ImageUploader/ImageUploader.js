import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import './ImageUploader.css';

const ImageUploader = ({ onUpload, showDropzone, showImages, onTextSubmit }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [zip, setZip] = useState('');
  const [itemcategory, setItemcategory] = useState('');

  const handleUpload = useCallback(
    async (uploadedFiles) => {
      console.log('handleUpload called');

      try {
        if (title.trim() === '' || description.trim() === '' || zip.trim() === '' || itemcategory.trim() === '') {
          alert('Title and description and zip and itemcategory are required.');
          return;
        }

        const formData = new FormData();
        formData.append('title', title);
        console.log("titleform data after apend:", title);
        formData.append('description', description);
        formData.append('zip', zip);
        formData.append('itemcategory', itemcategory);
        console.log("descform data after apend:", description);
        console.log("zipform data after apend:", zip);
        console.log("itemcategform data after apend:", itemcategory);
        console.log("FormData after apending desc and title and zip", formData);

        console.log('Uploaded Files:', uploadedFiles);


        // Iterate over the imageUrls array and append each URL to the FormData object
        uploadedFiles.forEach(file => {
          formData.append('image', file); // Append each file with the key 'image'
        });
        console.log("FormData after apending img", formData);

        const response = await fetch('http://localhost:5000/uploadimage', {
          method: 'POST',
          body: formData,
          // Omit Content-Type header to let the browser set it automatically
        });

        if (!response.ok) {
          console.error('Failed to upload images. Status:', response.status);
          console.error('Response:', await response.text());
          throw new Error(`Failed to upload images. Status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Response from server sent data:', data);

        if (data && data.uploadedData && data.uploadedData.urls) {
          // Check if the necessary properties are present in the response
          if (onTextSubmit) {
            // Pass title, description, and image URLs to the parent component
            onTextSubmit(title, description, data.uploadedData.urls, zip, itemcategory);
          }

          setUploadedImages((prevImages) => [
            ...prevImages,
            {
              name: 'Image',
              dataURL: data.uploadedData.urls[0],
            },
          ]);
          console.log('Image URL:', data.uploadedData.urls[0]);

          if (onUpload) {
            onUpload(uploadedFiles);
          }

          // Log title, description, and URL
          console.log('Title:', title);
          console.log('Description:', description);
          console.log('zipcode:', zip);
          console.log('itemcategory:', itemcategory);
          console.log('Image URL:', data.uploadedData.urls[0]);
        } else {
          console.error('Invalid response from server:', data);
        }
      } catch (error) {
        console.error('Error:', error);
      }
    },
    [onUpload, title, description, zip, itemcategory, onTextSubmit]
  );
  useEffect(() => {
    // Revoke object URLs when component unmounts
    return () => {
      uploadedImages.forEach((image) => {
        URL.revokeObjectURL(image.dataURL);
      });
    };
  }, [uploadedImages]);
  useEffect(() => {
    console.log('Title:', title);
    console.log('Description:', description);
    console.log('zip:', zip);
    console.log('itemcategory:', itemcategory);
  }, [title, description, zip, itemcategory]);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleUpload,
    accept: 'image/jpeg',
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB in bytes
  });

  const handleTextClick = (e) => {
    e.stopPropagation(); // Stop the click event from reaching the parent div
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();

    if (title.trim() === '' || description.trim() === '' || zip.trim() === '' || itemcategory.trim() === '') {
      alert('Title, description, and Zip and itemcategory are required.');
      return;
    }

    if (typeof onTextSubmit === 'function') {
      // Pass title, description, and zip directly to onTextSubmit
      onTextSubmit(title, description, zip);
    }

    // Reset input fields if needed
    setTitle('');
    setDescription('');
    setZip('');
    setItemcategory('');
  };

  return (
    <div>
      {showDropzone && (
        <div {...getRootProps()} className="dropzone" id="dropzoneEditor">
          <input {...getInputProps()} />
          <p>Drag images into click here to add images or drop them into this box</p>
          <div className="plus-sign">+</div>
          <form className="InfoForm" onSubmit={handleTextSubmit}>
            <p>
              <label for="ItemName">Item Name/Title</label>
            </p>
            <input className="ItemNameField"
              id="ItemName"
              type="text"
              placeholder="Please enter in the title of your item/items"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onClick={handleTextClick}
            />
            <p>
              <label for="ItemInfo">Description</label>
            </p>
            <textarea className='DescrField'
              id="ItemInfo"
              type="text"
              placeholder="Please enter any relevant info about your donation (amount, condition, extra info, etc.)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              onClick={handleTextClick}
              rows="6"
              columns="150"

            />
            <p>
              <label for="ItemZip">Zipcode</label>
            </p>
            <input className="ZipField"
              id="ItemZip"
              type="text"
              placeholder="Please enter your current zipcode"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
              onClick={handleTextClick}
            />
            <p>
              <label for="ItemCat">Item Category</label>
            </p>
            <select
              id="ItemCat"
              value={itemcategory}
              onChange={(e) => {
                e.preventDefault(); // Prevent default form submission behavior
                setItemcategory(e.target.value);
              }}
            >
              <option value="">Select Item Category</option>
              <option value="pencils">Pencils</option>
              <option value="books">Books</option>
              <option value="papers">Papers</option>
              <option value="pens">Pens</option>
              <option value="erasers">Erasers</option>
              <option value="markers">Markers</option>
              <option value="dry erase markers">Dry Erase Markers</option>
              <option value="dry erase boards">Dry Erase Boards</option>
            </select>
          </form>
        </div>
      )}

      {showImages && uploadedImages.length > 0 && (
        <div className="imageGrid">
          {uploadedImages.map((image, index) => (
            <div key={index} className="imageItem">
              <img
                src={image.dataURL}
                alt={image.name}
                style={{ width: '250px', height: '250px', objectFit: 'fill' }}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
