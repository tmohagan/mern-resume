import React, { useState } from 'react';
import api from '../api';

function SentimentAnalyzer() {
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState(null);

  const getEmoji = (sentiment) => {
    switch (sentiment) {
      case 'positive':
        return '😄'; // Smiling face with open mouth
      case 'negative':
        return '😔'; // Pensive face
      case 'neutral':
        return '😐'; // Neutral face
      default:
        return '❓'; // Question mark
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/analyze', { text }, {
        baseURL: process.env.REACT_APP_PYTHON_SENTIMENT_API_URL
      });
      setSentiment(response.data.sentiment);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
      // You might want to set an error state here and display it to the user
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} />
        <button type="submit">Analyze Sentiment</button>
      </form>

      {sentiment && (
        <div>
          <h2>Sentiment: {getEmoji(sentiment)}</h2> 
        </div>
      )}
    </div>
  );
}

export default SentimentAnalyzer;