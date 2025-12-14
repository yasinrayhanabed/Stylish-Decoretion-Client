// আপনার backend server file এ এই code যোগ করুন

// Decorator request route
app.post('/api/decorator-requests', async (req, res) => {
  try {
    const { experience, specialty, portfolio, description, phone, location, expectedRate } = req.body;
    
    // Validation
    if (!experience || !specialty || !description || !phone || !location) {
      return res.status(400).json({ 
        error: 'Required fields missing: experience, specialty, description, phone, location' 
      });
    }

    // Database save করুন (আপনার database অনুযায়ী)
    // const newRequest = await DecoratorRequest.create(req.body);
    
    // Temporary response (database connection না থাকলে)
    console.log('Decorator request received:', req.body);
    
    res.status(201).json({
      message: 'Decorator request submitted successfully',
      data: req.body
    });
    
  } catch (error) {
    console.error('Error saving decorator request:', error);
    res.status(500).json({ 
      error: 'Internal server error' 
    });
  }
});

// Health check route (optional)
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend server is running!' });
});