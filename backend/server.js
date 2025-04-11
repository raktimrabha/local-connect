const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow requests

app.get('/api/hello', (req, res) => {
  console.log("Backend: Received request for /api/hello");
  res.json({ message: "Backend says Hello via Bootstrap! 🚀" }); // Updated message
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
