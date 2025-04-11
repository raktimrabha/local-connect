import React, { useState, useEffect } from 'react';
// No need to import App.css

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    console.log(`Frontend: Fetching from ${API_URL}/api/hello`);
    fetch(`${API_URL}/api/hello`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Frontend: Received data:", data);
        setMessage(data.message);
      })
      .catch((error) => {
        console.error("Frontend: Fetch error:", error);
        setMessage(`Failed to load: ${error.message}`);
      });
  }, []);

  // Using Bootstrap classes for layout and styling
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card text-center shadow p-4">
        <div className="card-body">
          <h1 className="card-title text-primary mb-3">
            Frontend (Bootstrap)
          </h1>
          <p className="card-text">Message from Backend:</p>
          <p className="alert alert-success mt-3" role="alert">
            {message}
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
