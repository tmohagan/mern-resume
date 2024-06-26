import React, { useState } from 'react';

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

    const response = await fetch(`${process.env.REACT_APP_PYTHON_SENTIMENT_API_URL}/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();
    setSentiment(data.sentiment);
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