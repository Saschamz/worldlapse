import React from 'react';
import './Spinner.css';

const Spinner = props => {
  const { x, y } = props.position;
  
  return (
    <div className="spinner-container" style={{transform: `translate(${x - 30}px, ${y - 30}px)`}}>
      <div className="lds-dual-ring"></div>
    </div>
  );
}

export default Spinner;
