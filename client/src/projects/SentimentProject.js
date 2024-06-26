import React, { useState } from 'react';

function SentimentAnalyzer() {
  const [text, setText] = useState('');
  const [sentiment, setSentiment] = useState(null);

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
          <h2>Sentiment: {sentiment}</h2>
        </div>
      )}
    </div>
  );
}

export default SentimentAnalyzer;