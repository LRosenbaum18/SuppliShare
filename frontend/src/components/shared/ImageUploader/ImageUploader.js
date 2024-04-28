import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { useMsal, useAccount } from '@azure/msal-react';
import './ImageUploader.css';
{/*imports */}
const ImageUploader = ({ onUpload, showDropzone, showImages, onTextSubmit }) => {
  const [uploadedImages, setUploadedImages] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [zip, setZip] = useState('');
  const [itemcategory, setItemcategory] = useState('');
  {/*disable apparent unused since the database is still getting sent this information */}
  // eslint-disable-next-line no-unused-vars
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false); // Loading state
  const [filesToUpload, setFilesToUpload] = useState([]); // Files to upload
  const { accounts } = useMsal(); // Get MSAL accounts
  const account = useAccount(accounts[0] || {}); // Get the first account
{/*uploadedimages, title, description,zip,itemcategory,loading,files to uploading, use msal and use account handle drop with accepted files, set files to uploaded to accepted files */}
  const handleDrop = useCallback((acceptedFiles) => {
    setFilesToUpload(acceptedFiles);
	console.log('Files to upload:', acceptedFiles);
  }, []);
{/*handle submit stops the information from automatically being submitted */}
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent default form submission

    try {
      setLoading(true); // Set loading state to true
      {/*append form data with title, desc, zip, itemcategory, email, append each image url, */}
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('zip', zip);
      formData.append('itemcategory', itemcategory);
      formData.append('email', account.username); // Add email to formData

      filesToUpload.forEach(file => {
        formData.append('image', file);
		
      });
      {/*await fetch with uploadimage sent as a post req*/}
      const response = await fetch('http://localhost:5000/uploadimage', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
		  {/*if response is not okay log the error. */}
        console.error('Failed to upload images. Status:', response.status);
        console.error('Response:', await response.text());
        throw new Error(`Failed to upload images. Status: ${response.status}`);
      }

      const data = await response.json();
	  {/*response from the server */}
      console.log('Response from server:', data);
       {/*text submission/form box handling of title, description, url, zip, itemcategory */}
      if (data && data.uploadedData && data.uploadedData.urls) {
        if (onTextSubmit) {
          onTextSubmit(title, description, data.uploadedData.urls, zip, itemcategory);
        }
        {/*set prev images */}
        setUploadedImages((prevImages) => [
          ...prevImages,
          {
            name: 'Image',
            dataURL: data.uploadedData.urls[0],
          },
        ]);
        {/*handlee on upload */}
        if (onUpload) {
          onUpload(uploadedImages);
        }
        {/*log title, desc, zip, itemcategory, urls, and account name, and data */}
        console.log('Title:', title);
        console.log('Description:', description);
        console.log('zipcode:', zip);
        console.log('itemcategory:', itemcategory);
        console.log('Image URL:', data.uploadedData.urls[0]);
        console.log('email', account.username);
      } else {
        console.error('Invalid response from server:', data);
      }
    } catch (error) {
		{/*log error  and set loading */}
      console.error('Error:', error);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  useEffect(() => {
    if (account) {
      const userEmail = account.username || ''; // Get the user's email
      setEmail(userEmail); // Set the email state
    } else {
      // Set default email value to "guest"
      setEmail('guest');
      console.log('Default email set to "guest"');
    }
  }, [account]);
  {/*restrict dropzone on drop, accept only jpeg images with a max of 5 files, with a max size of 10mb */}
  const { getRootProps, getInputProps } = useDropzone({
    onDrop: handleDrop,
    accept: 'image/jpeg',
    maxFiles: 5,
    maxSize: 10 * 1024 * 1024, // 10MB in bytes
  });

  return (
    <div>
	{/*show the dropzone, stop the event from progating the data automatically  */}
      {showDropzone && (
  <div {...getRootProps({ onClick: (event) => event.stopPropagation() })} className="dropzone" id="dropzoneEditor">
    <input {...getInputProps()} />
	{/*input */}
    <p>drop every image into this box. a preview will be shown</p>
	{/*drag the images into the box,  */}
    <div className="plus-sign">+</div>
	{/*visuals */}
    <form className="InfoForm" onSubmit={(event) => event.preventDefault()}>
	{/*information form, does not automatically uploaded on change, stops the defaut propagation of the data */}
      <p>
	{/*item name, title, item info item zip, item category etc input forms */}  
        <label htmlFor="ItemName">Item Name/Title</label>
      </p>
      <input
        id="ItemName"
        type="text"
        placeholder="Please enter in the title of your item/items"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <p className="DescLabel">
        <label htmlFor="ItemInfo">Description</label>
      </p>
      <textarea
        id="ItemInfo"
        type="text"
        placeholder="Please enter any relevant info about your donation (amount, condition, extra info, etc.)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows="6"
        columns="150"
      />
      <p>
        <label htmlFor="ItemZip">Zipcode</label>
      </p>
      <input
        id="ItemZip"
        type="text"
        placeholder="Please enter your current zipcode"
        value={zip}
        onChange={(e) => setZip(e.target.value)}
      />
      <p className="CatLabel">
        <label className='CategoryLabel' htmlFor="ItemCat">Item Category</label>
      </p>
      <select
        id="ItemCat"
        value={itemcategory}
        onChange={(e) => {
          e.preventDefault();
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
      <button disabled={loading} onClick={handleSubmit}>Submit Form</button>
    </form>
	{/*used to preview the images after the user has uploaded them, map the files to upload and key them so they are shown. src to object url, and alt to preview index num,*/}
{loading && <div>Loading...</div>}
          <div className="previewImages">
            {filesToUpload.map((file, index) => (
              <div key={index} className="previewImage">
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index}`}
                  style={{  width: '50px', height: '50px' }}
                />
              </div>
            ))}
          </div>
        </div>
      )}
     {/*show the images  */}
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