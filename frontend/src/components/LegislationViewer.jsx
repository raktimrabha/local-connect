// src/components/LegislationViewer.jsx
import React, { useState } from 'react';

// Receives legislation data and the vote handler function from App.jsx
function LegislationViewer({ legislationItems, onVote }) {
  // State to track language view for each item { legId: true } means plain view
  const [plainView, setPlainView] = useState({});

  const toggleLanguage = (id) => {
    setPlainView((prev) => ({
      ...prev,
      [id]: !prev[id], // Toggle the boolean value
    }));
  };

  // Call the onVote function passed from App.jsx
  const handleVoteClick = (id, voteType) => {
    onVote(id, voteType);
  };

  // Check if data is available
  if (!legislationItems || legislationItems.length === 0) {
      return (
          <div className="mb-4 p-4 bg-light border rounded">
              <h2 className="h5 mb-3">Example Legislation</h2>
              <p className="text-muted">Loading legislation...</p>
          </div>
      );
  }

  return (
    <div className="mb-4 p-4 bg-light border rounded">
      <h2 className="h5 mb-3">Example Legislation</h2>
      {legislationItems.map((item) => (
        <div key={item.id} className="card legislation-card shadow-sm">
          <div className="card-body">
            <h3 className="card-title h6">{item.title}</h3>
            <button
              onClick={() => toggleLanguage(item.id)}
              className="btn btn-sm btn-outline-secondary language-toggle-btn float-end"
            >
              {plainView[item.id] ? 'Show Technical' : 'Show Plain Language'}
            </button>
            <p className="card-text mt-2">
              {plainView[item.id]
                ? item.plain_summary
                : item.technical_summary}
            </p>
            <div className="d-flex justify-content-start align-items-center mt-3 vote-section">
              <button
                onClick={() => handleVoteClick(item.id, 'up')}
                className="btn btn-sm btn-success me-2"
                aria-label={`Upvote ${item.title}`}
              >
                👍 Upvote
              </button>
              <button
                onClick={() => handleVoteClick(item.id, 'down')}
                className="btn btn-sm btn-danger"
                aria-label={`Downvote ${item.title}`}
              >
                👎 Downvote
              </button>
              <span className="ms-3">
                Votes: <span className="text-success">+{item.votes.up}</span> / <span className="text-danger">-{item.votes.down}</span>
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default LegislationViewer;
