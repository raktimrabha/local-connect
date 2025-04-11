// src/App.jsx
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

import Header from './components/Header';
import NeighborhoodSelector from './components/NeighborhoodSelector';
import LegislationViewer from './components/LegislationViewer';
import FeedbackForm from './components/FeedbackForm';
import PolicyChart from './components/PolicyChart';

// Hardcode chart data here or import from a separate file if preferred
const policyImpactChartData = {
  labels: ['Downtown', 'Uptown', 'Westside', 'Eastside', 'River North'],
  datasets: [
    {
      label: 'Estimated Positive Impact Score (Policy X)',
      data: [75, 60, 85, 70, 55],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
      borderColor: 'rgba(54, 162, 235, 1)',
      borderWidth: 1,
    },
  ],
};

// Get backend URL from environment variable (important for deployment)
const BACKEND_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';
const socket = io(BACKEND_URL); // Connect to Socket.IO server

function App() {
  // State for data fetched from backend
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [issues, setIssues] = useState([]);
  const [legislation, setLegislation] = useState([]);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for UI interaction
  const [selectedNeighborhood, setSelectedNeighborhood] = useState('');

  // --- Fetch Initial Data ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BACKEND_URL}/api/data`);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setNeighborhoods(data.neighborhoods || []);
        setIssues(data.issues || []);
        setLegislation(data.legislation || []);
        setFeedbackCount(data.feedbackCount || 0);
      } catch (err) {
        console.error("Failed to fetch initial data:", err);
        setError("Could not load data from server. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []); // Empty dependency array means run once on mount

  // --- Socket.IO Listeners ---
  useEffect(() => {
    // Listen for updates from the server
    socket.on('legislationUpdated', (updatedLegislation) => {
      console.log('Received legislationUpdated from server');
      setLegislation(updatedLegislation);
    });

    socket.on('feedbackCountUpdated', (updatedCount) => {
      console.log('Received feedbackCountUpdated from server');
      setFeedbackCount(updatedCount);
    });

    // Clean up listeners when component unmounts
    return () => {
      socket.off('legislationUpdated');
      socket.off('feedbackCountUpdated');
    };
  }, []); // Run only once

  // --- Event Handlers ---
  const handleNeighborhoodChange = (neighborhood) => {
    setSelectedNeighborhood(neighborhood);
  };

  const handleVote = async (legislationId, voteType) => {
    console.log(`Voting ${voteType} on ${legislationId}`);
    try {
      const response = await fetch(`${BACKEND_URL}/api/legislation/${legislationId}/vote`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voteType }),
      });
      if (!response.ok) {
        throw new Error(`Vote API error! Status: ${response.status}`);
      }
      // No need to update state directly, Socket.IO will push the update
    } catch (err) {
      console.error("Failed to submit vote:", err);
      // Optionally show an error message to the user
    }
  };

  const handleFeedbackSubmit = async (comment) => {
    console.log(`Submitting feedback: "${comment}"`);
    try {
      const response = await fetch(`${BACKEND_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ comment }), // Send comment even if not stored
      });
       if (!response.ok) {
        throw new Error(`Feedback API error! Status: ${response.status}`);
      }
       // No need to update state directly, Socket.IO will push the update
       alert('Feedback submitted!'); // Simple confirmation
    } catch (err) {
       console.error("Failed to submit feedback:", err);
       alert('Failed to submit feedback. Please try again.');
    }
  };

  // --- Render Logic ---
  if (isLoading) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  if (error) {
     return <div className="container mt-5 alert alert-danger">{error}</div>;
  }

  return (
    <>
      <Header />
      <main className="container mt-4">
        <div className="row g-4">
          {/* Column 1 */}
          <div className="col-md-6">
            <NeighborhoodSelector
              neighborhoods={neighborhoods}
              issues={issues}
              selectedNeighborhood={selectedNeighborhood}
              onNeighborhoodChange={handleNeighborhoodChange}
            />
            <FeedbackForm
              feedbackCount={feedbackCount}
              onFeedbackSubmit={handleFeedbackSubmit}
            />
          </div>

          {/* Column 2 */}
          <div className="col-md-6">
            <LegislationViewer
              legislationItems={legislation}
              onVote={handleVote}
            />
            <PolicyChart chartData={policyImpactChartData} />
          </div>
        </div>
      </main>
      <footer className="text-center text-muted py-4 mt-4">
        <small>MVP Demo - Hackathon 2025</small>
      </footer>
    </>
  );
}

export default App;