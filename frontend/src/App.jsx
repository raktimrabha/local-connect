import React, { useState, useEffect } from 'react';

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

  // Using a mix of Bootstrap classes and our custom Sass classes
  return (
    <div className="container mt-5"> {/* Bootstrap container with margin-top */}
      <div className="card text-center shadow-sm"> {/* Bootstrap card */}
        <div className="card-header">
          Featured App
        </div>
        <div className="card-body">
          {/* Using our custom class */}
          <h1 className="my-custom-heading mb-3">
            Frontend (Bootstrap + Custom Sass)
          </h1>
          {/* Using our custom class */}
          <p className="custom-text">Message from Backend:</p>
          {/* Bootstrap alert (should have slightly more rounded corners from our override) */}
          <p className="alert alert-info mt-3" role="alert">
            {message}
          </p>
          {/* Standard Bootstrap button */}
          <button className="btn btn-primary">Bootstrap Button</button>
        </div>
        <div className="card-footer text-muted"> {/* Bootstrap card footer */}
          Powered by Vite & React
        </div>
      </div>
    </div>
  );
}

export default App;
