const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/api/hello', (req, res) => {
  console.log("Backend: Received request for /api/hello");
  // Changed message slightly to confirm update
  res.json({ message: "Backend Powering Custom Sass! ⚡" });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
