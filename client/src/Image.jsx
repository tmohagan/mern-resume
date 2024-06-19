import React from 'react';

export default function Image({ src, alt }) {
  return (
    <img 
      src={src} 
      alt={'image not available'}
      style={{ width: '100%', height: 'auto' }}  // Make image responsive
    />
  );
}
