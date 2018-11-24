import React from 'react';
import './Feed.css';

const Feed = props => {
  const { src, country, city } = props.data;

  return (
    <div className="feed">
      <h1>{country}, {city}</h1>
      <iframe title="feed" src={src + '?autoplay=1'}></iframe>
    </div>
  );
}

export default Feed;
