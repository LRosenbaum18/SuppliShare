// ItemUpload.jsx
import React from 'react';
import ImageUploader from '../ImageUploader/ImageUploader';


const ItemUpload = ({ onTextSubmit }) => {
  return (
  /*parent component this is where imageuploader is getting called. */
    <div style={{ textAlign: 'center', marginTop: '50px', marginLeft: '300px' }}>
      <h1>Upload Items</h1>
      <div style={{ marginTop: '20px', marginLeft: '0px' }}>
        <ImageUploader
          onTextSubmit={onTextSubmit}
          showDropzone={true}
          showInputs={true}
		  
        />
      </div>
      
      
    </div>
  );
};

export default ItemUpload;
