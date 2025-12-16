// SMS Notification System (Mock Implementation)
export const sendSMS = async (phoneNumber, message, type = 'general') => {
  // Mock SMS sending - replace with actual SMS service
  console.log(`📱 SMS Sent to ${phoneNumber}:`, message);
  
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        messageId: `sms_${Date.now()}`,
        timestamp: new Date().toISOString()
      });
    }, 1000);
  });
};

export const smsTemplates = {
  booking_confirmed: (bookingId, serviceName, date) => 
    `✅ Booking confirmed! ID: ${bookingId}. Service: ${serviceName} on ${date}. Thank you for choosing StyleDecor!`,
  
  booking_reminder: (serviceName, date, time) => 
    `⏰ Reminder: Your ${serviceName} is scheduled for ${date} at ${time}. Our decorator will contact you soon.`,
  
  decorator_assigned: (decoratorName, phone) => 
    `👨‍🎨 Decorator assigned! ${decoratorName} will handle your project. Contact: ${phone}`,
  
  payment_received: (amount, bookingId) => 
    `💰 Payment of ৳${amount} received for booking ${bookingId}. Thank you!`,
  
  service_completed: (serviceName) => 
    `🎉 Your ${serviceName} is complete! Please rate your experience. Thank you for choosing StyleDecor!`,
    
  serviceUpdate: (serviceName) => 
    `🔄 Service Update: ${serviceName} has been updated with new features. Check it out now!`,
    
  bookingConfirmation: (serviceName, date, amount) => 
    `✅ Booking Confirmed! Service: ${serviceName}, Date: ${date}, Amount: ৳${amount}. Thank you for choosing StyleDecor!`
};

export const sendBookingNotification = async (booking, type) => {
  const { userPhone, serviceName, bookingId, scheduledDate } = booking;
  
  let message;
  switch (type) {
    case 'confirmed':
      message = smsTemplates.booking_confirmed(bookingId, serviceName, scheduledDate);
      break;
    case 'reminder':
      message = smsTemplates.booking_reminder(serviceName, scheduledDate, '10:00 AM');
      break;
    case 'completed':
      message = smsTemplates.service_completed(serviceName);
      break;
    default:
      message = `Update for booking ${bookingId}: ${serviceName}`;
  }
  
  return await sendSMS(userPhone, message, type);
};