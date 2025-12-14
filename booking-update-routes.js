// আপনার backend server file এ এই routes যোগ করুন

// Booking update route - Decorator assign করার জন্য
app.put('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { assignedDecorator, status } = req.body;
    
    // Database update করুন (আপনার database অনুযায়ী)
    // const updatedBooking = await Booking.findByIdAndUpdate(
    //   id, 
    //   { assignedDecorator, status },
    //   { new: true }
    // );
    
    // Temporary response (database connection না থাকলে)
    console.log(`Booking ${id} updated:`, { assignedDecorator, status });
    
    res.json({
      message: 'Booking updated successfully',
      data: { id, assignedDecorator, status }
    });
    
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ 
      error: 'Failed to update booking' 
    });
  }
});

// Booking status update route
app.put('/api/bookings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    // Database update করুন
    // const updatedBooking = await Booking.findByIdAndUpdate(
    //   id, 
    //   { status },
    //   { new: true }
    // );
    
    console.log(`Booking ${id} status updated to:`, status);
    
    res.json({
      message: 'Booking status updated successfully',
      data: { id, status }
    });
    
  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({ 
      error: 'Failed to update booking status' 
    });
  }
});

// Payment status update route
app.put('/api/bookings/:id/payment', async (req, res) => {
  try {
    const { id } = req.params;
    const { isPaid } = req.body;
    
    // Database update করুন
    // const updatedBooking = await Booking.findByIdAndUpdate(
    //   id, 
    //   { isPaid },
    //   { new: true }
    // );
    
    console.log(`Booking ${id} payment status updated to:`, isPaid);
    
    res.json({
      message: 'Payment status updated successfully',
      data: { id, isPaid }
    });
    
  } catch (error) {
    console.error('Error updating payment status:', error);
    res.status(500).json({ 
      error: 'Failed to update payment status' 
    });
  }
});

// PATCH route (alternative method)
app.patch('/api/bookings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Database update করুন
    // const updatedBooking = await Booking.findByIdAndUpdate(
    //   id, 
    //   updateData,
    //   { new: true }
    // );
    
    console.log(`Booking ${id} patched with:`, updateData);
    
    res.json({
      message: 'Booking updated successfully',
      data: { id, ...updateData }
    });
    
  } catch (error) {
    console.error('Error patching booking:', error);
    res.status(500).json({ 
      error: 'Failed to update booking' 
    });
  }
});