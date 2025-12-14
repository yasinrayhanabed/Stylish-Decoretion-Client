const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// File path for persistent storage
const DATA_FILE = path.join(__dirname, 'decorator-requests.json');

// Load data from file or use default
function loadData() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading data:', error);
  }
  
  // Default data if file doesn't exist
  return {
    decoratorRequests: [
      {
        _id: '1',
        user: {
          name: 'John Doe',
          email: 'john@example.com'
        },
        experience: '3-5',
        specialty: 'Wedding Decoration',
        phone: '01712345678',
        location: 'Dhaka, Bangladesh',
        expectedRate: '15000',
        portfolio: 'https://example.com/portfolio',
        description: 'I have been working as a decorator for 4 years with expertise in wedding decorations.',
        status: 'pending',
        createdAt: new Date().toISOString()
      },
      {
        _id: '2',
        user: {
          name: 'Sarah Ahmed',
          email: 'sarah@example.com'
        },
        experience: '1-3',
        specialty: 'Birthday Party',
        phone: '01798765432',
        location: 'Chittagong, Bangladesh',
        expectedRate: '8000',
        portfolio: 'https://example.com/sarah-portfolio',
        description: 'Passionate about creating memorable birthday celebrations for children and adults.',
        status: 'approved',
        createdAt: new Date(Date.now() - 86400000).toISOString()
      }
    ],
    requestIdCounter: 3
  };
}

// Save data to file
function saveData(data) {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error saving data:', error);
  }
}

// Load initial data
let { decoratorRequests, requestIdCounter } = loadData();

// Routes

// Get all decorator requests
app.get('/api/decorator-requests', (req, res) => {
  res.json(decoratorRequests);
});

// Create new decorator request
app.post('/api/decorator-requests', (req, res) => {
  console.log('Received decorator request:', req.body);
  
  try {
    const newRequest = {
      _id: requestIdCounter.toString(),
      user: {
        name: 'Current User', // In real app, this would come from JWT token
        email: 'user@example.com'
      },
      ...req.body,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    decoratorRequests.push(newRequest);
    requestIdCounter++;
    
    // Save to file
    saveData({ decoratorRequests, requestIdCounter });
    
    console.log('Request saved successfully:', newRequest._id);
    res.status(201).json(newRequest);
  } catch (error) {
    console.error('Error creating decorator request:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

// Approve decorator request
app.put('/api/decorator-requests/:id/approve', (req, res) => {
  const requestId = req.params.id;
  const requestIndex = decoratorRequests.findIndex(req => req._id === requestId);
  
  if (requestIndex === -1) {
    return res.status(404).json({ message: 'Request not found' });
  }
  
  decoratorRequests[requestIndex].status = 'approved';
  
  // Save to file
  saveData({ decoratorRequests, requestIdCounter });
  
  res.json(decoratorRequests[requestIndex]);
});

// Reject decorator request
app.put('/api/decorator-requests/:id/reject', (req, res) => {
  const requestId = req.params.id;
  const requestIndex = decoratorRequests.findIndex(req => req._id === requestId);
  
  if (requestIndex === -1) {
    return res.status(404).json({ message: 'Request not found' });
  }
  
  decoratorRequests[requestIndex].status = 'rejected';
  
  // Save to file
  saveData({ decoratorRequests, requestIdCounter });
  
  res.json(decoratorRequests[requestIndex]);
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Mock server running on port ${PORT}`);
  console.log(`API endpoints available at http://localhost:${PORT}/api`);
});