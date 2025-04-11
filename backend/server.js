// backend/server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');

const app = express();
app.use(cors()); // Allow requests from frontend
app.use(express.json()); // Middleware to parse JSON request bodies

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: '*', // Allow all origins for simplicity (restrict in production!)
    methods: ['GET', 'POST'],
  },
});

// --- In-Memory Data Store ---
// IMPORTANT: Data resets when server restarts!
let dataStore = {
  neighborhoods: [
    'Downtown',
    'Uptown',
    'Westside',
    'Eastside',
    'River North',
  ],
  issues: [
     { id: 1, title: 'Pothole on Main St', description: 'Large pothole near the library needs filling.', neighborhood: 'Downtown' },
     { id: 2, title: 'Broken Streetlight on Elm Ave', description: 'Streetlight out for 3 days, safety concern.', neighborhood: 'Uptown' },
     { id: 3, title: 'Park Cleanup Initiative', description: 'Proposal for monthly volunteer park cleanups.', neighborhood: 'Westside' },
     { id: 4, title: 'Graffiti on Bridge', description: 'Graffiti appeared on the pedestrian bridge.', neighborhood: 'Downtown' },
     { id: 5, title: 'Recycling Pickup Schedule Change', description: 'Discussion about changing recycling pickup days.', neighborhood: 'Eastside' },
     { id: 6, title: 'Crosswalk Safety Study', description: 'Request for a study on the Oak St crosswalk.', neighborhood: 'Uptown' },
     { id: 7, title: 'New Community Garden Location', description: 'Potential site identified near the river.', neighborhood: 'River North' },
     { id: 8, title: 'Noise Complaint - Construction', description: 'Early morning construction noise reported.', neighborhood: 'Westside' },
     { id: 9, title: 'Bike Lane Proposal - 1st Ave', description: 'Proposal to add protected bike lanes.', neighborhood: 'Downtown' },
     { id: 10, title: 'Library Hour Extension Request', description: 'Petition to extend library hours on weekends.', neighborhood: 'Eastside' },
  ],
  legislation: [
    {
      id: 'leg101',
      title: 'Green Spaces Initiative Act',
      technical_summary: 'Allocate 0.5% of municipal budget towards the acquisition and maintenance of new public green spaces, prioritizing areas with less than 1 acre per 1000 residents. Mandates ecological impact assessments for proposed sites.',
      plain_summary: 'Set aside a small part of the city budget to buy land and take care of new parks, especially in neighborhoods that don\'t have many parks already. We need to check how new parks might affect local plants and animals.',
      votes: { up: 15, down: 3 },
    },
    {
      id: 'leg102',
      title: 'Public Transit Enhancement Bill',
      technical_summary: 'Implement dedicated bus lanes on arterial routes A, B, and C during peak hours (7-9 AM, 4-6 PM). Increase frequency of routes 5, 8, 12 to every 15 minutes. Fund via a 0.1% sales tax increment.',
      plain_summary: 'Create special lanes just for buses on busy roads during rush hour to make trips faster. Make buses on popular routes run more often (every 15 minutes). Pay for it by slightly increasing the sales tax.',
      votes: { up: 28, down: 12 },
    },
    {
      id: 'leg103',
      title: 'Affordable Housing Zoning Reform',
      technical_summary: 'Amend zoning code R-2 to permit accessory dwelling units (ADUs) by-right on qualifying lots. Reduce minimum lot size requirements in designated transit corridors by 15%. Establish density bonuses for projects including >20% affordable units.',
      plain_summary: 'Change building rules to allow homeowners to build small extra apartments (like backyard cottages) on their property more easily. Allow slightly smaller lots for new houses near bus/train lines. Give benefits to builders who include more affordable homes in their projects.',
      votes: { up: 45, down: 8 },
    },
  ],
  feedbackCount: 0,
  // Chart data remains hardcoded on frontend for simplicity
};
// --- End In-Memory Data Store ---

// --- API Endpoints ---

// Get all initial data needed by the frontend
app.get('/api/data', (req, res) => {
  console.log('GET /api/data');
  res.json({
    neighborhoods: dataStore.neighborhoods,
    issues: dataStore.issues,
    legislation: dataStore.legislation,
    feedbackCount: dataStore.feedbackCount,
  });
});

// Handle a vote on legislation
app.post('/api/legislation/:id/vote', (req, res) => {
  const { id } = req.params;
  const { voteType } = req.body; // 'up' or 'down'

  console.log(`POST /api/legislation/${id}/vote - Type: ${voteType}`);

  const legIndex = dataStore.legislation.findIndex((item) => item.id === id);

  if (legIndex === -1) {
    return res.status(404).json({ message: 'Legislation not found' });
  }
  if (voteType !== 'up' && voteType !== 'down') {
    return res.status(400).json({ message: 'Invalid vote type' });
  }

  // Update vote count
  dataStore.legislation[legIndex].votes[voteType]++;

  // Broadcast the updated legislation list to all clients
  io.emit('legislationUpdated', dataStore.legislation);
  console.log('Emitted legislationUpdated');

  res.status(200).json(dataStore.legislation[legIndex]); // Send back updated item
});

// Handle feedback submission
app.post('/api/feedback', (req, res) => {
  const { comment } = req.body; // We receive the comment but don't store it
  console.log(`POST /api/feedback - Comment received (not stored): "${comment}"`);

  dataStore.feedbackCount++;

  // Broadcast the updated feedback count to all clients
  io.emit('feedbackCountUpdated', dataStore.feedbackCount);
  console.log('Emitted feedbackCountUpdated');

  res.status(200).json({ feedbackCount: dataStore.feedbackCount });
});

// --- Socket.IO Connection Logic ---
io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  // Optional: Send current state when a user connects?
  // Could send initial data here instead of relying solely on API fetch
  // socket.emit('initialData', dataStore);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// --- Start Server ---
const PORT = process.env.PORT || 3001; // Use Railway's port or 3001 locally
server.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
