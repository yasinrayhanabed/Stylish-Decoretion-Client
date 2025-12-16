// Mock SMS Notification System
export const sendSMS = async (phoneNumber, message, type = 'booking') => {
  // Mock SMS sending - in production, integrate with SMS gateway
  console.log(`📱 SMS Sent to ${phoneNumber}:`);
  console.log(`Message: ${message}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: true,
    messageId: `SMS_${Date.now()}`,
    timestamp: new Date().toISOString(),
    type,
    recipient: phoneNumber
  };
};

export const smsTemplates = {
  bookingConfirmation: (bookingId, serviceName, date) => 
    `✅ Booking Confirmed! ID: ${bookingId}. Service: ${serviceName} on ${date}. Thank you for choosing StyleDecor!`,
  
  bookingReminder: (serviceName, date, time) => 
    `⏰ Reminder: Your ${serviceName} appointment is tomorrow at ${time} on ${date}. We're excited to transform your space!`,
  
  decoratorAssigned: (decoratorName, contactNumber) => 
    `👨‍🎨 Decorator Assigned! ${decoratorName} will handle your project. Contact: ${contactNumber}`,
  
  paymentReceived: (amount, bookingId) => 
    `💳 Payment of ৳${amount} received for booking ${bookingId}. Thank you!`,
  
  serviceCompleted: (serviceName, rating_link) => 
    `🎉 Service completed! Hope you love your new ${serviceName}. Rate us: ${rating_link}`,
  
  couponCode: (code, discount, expiry) => 
    `🎁 Special offer! Use code ${code} for ${discount}% off. Valid till ${expiry}. Book now!`
};

export const sendBookingNotification = async (booking, type) => {
  const { userPhone, serviceName, bookingId, scheduledDate } = booking;
  
  let message = '';
  switch (type) {
    case 'confirmation':
      message = smsTemplates.bookingConfirmation(bookingId, serviceName, scheduledDate);
      break;
    case 'reminder':
      message = smsTemplates.bookingReminder(serviceName, scheduledDate, '10:00 AM');
      break;
    case 'completed':
      message = smsTemplates.serviceCompleted(serviceName, 'https://styledecor.com/rate');
      break;
    default:
      message = `Update for booking ${bookingId}: ${serviceName}`;
  }
  
  return await sendSMS(userPhone, message, type);
};