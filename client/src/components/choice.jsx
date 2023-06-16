import React from 'react';
import "./choice.css";

const Choice = ({ option, onClick }) => {
    return (
      <button className='choice' onClick={ onClick }>
        {option}
      </button>
    );
  };
  
  export default Choice;