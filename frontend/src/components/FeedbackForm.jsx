// src/components/FeedbackForm.jsx
import React, { useState } from 'react';

function FeedbackForm({ feedbackCount, onFeedbackSubmit }) {
  const [comment, setComment] = useState('');

  const handleSubmit = () => {
    onFeedbackSubmit(comment); // Pass the comment text to the handler
    setComment(''); // Clear the textarea after submission
  };

  return (
    <div className="mb-4 p-4 bg-light border rounded">
      <h2 className="h5 mb-3">Submit General Feedback</h2>
      <div className="mb-3">
        <label htmlFor="feedbackText" className="form-label">
          Your Feedback:
        </label>
        <textarea
          id="feedbackText"
          className="form-control"
          rows="3"
          placeholder="Enter your thoughts here..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></textarea>
      </div>
      <button onClick={handleSubmit} className="btn btn-info">
        Submit Feedback
      </button>
      <p className="mt-3 mb-0 text-muted">
        Total Feedback Submissions: {feedbackCount}
      </p>
    </div>
  );
}

export default FeedbackForm;
