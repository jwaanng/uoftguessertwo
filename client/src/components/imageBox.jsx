import React from 'react';
import "./imageBox.css";

const ImageBox = ({ imageUrl }) => {
  return (
    <div className='imagebox'>
      <img className='image' src={imageUrl} alt="Image" />
    </div>
  );
};

export default ImageBox;
