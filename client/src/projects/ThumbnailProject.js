import React, { useState } from 'react';
import api from '../api';

function ThumbnailProject() {
  const [imageUrl, setImageUrl] = useState('');
  const [width, setWidth] = useState(100);
  const [height, setHeight] = useState(100);
  const [thumbnailData, setThumbnailData] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await api.get('/generate', {
        baseURL: process.env.REACT_APP_JAVA_THUMBNAIL_API_URL,
        params: {
          imageUrl: encodeURIComponent(imageUrl),
          width,
          height
        },
        responseType: 'text'
      });
      setThumbnailData(response.data);
    } catch (err) {
      setError("Error generating thumbnail. Please check the URL and server.");
      console.error(err);
    }
  };

  return (
    <div>
      <h1>Thumbnail Generator</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="imageUrl">Image URL:</label>
          <input 
            type="text" 
            id="imageUrl" 
            value={imageUrl} 
            onChange={(e) => setImageUrl(e.target.value)} 
          />
        </div>
        <div>
          <label htmlFor="width">Width:</label>
          <input 
            type="number" 
            id="width" 
            value={width} 
            onChange={(e) => setWidth(parseInt(e.target.value, 10))}
          />
        </div>
        <div>
          <label htmlFor="height">Height:</label>
          <input 
            type="number" 
            id="height" 
            value={height} 
            onChange={(e) => setHeight(parseInt(e.target.value, 10))} 
          />
        </div>
        <button type="submit">Generate Thumbnail</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {thumbnailData && (
        <div>
          <h2>Generated Thumbnail:</h2>
          <img src={thumbnailData} alt="Thumbnail" />
        </div>
      )}
    </div>
  );
}

export default ThumbnailProject;