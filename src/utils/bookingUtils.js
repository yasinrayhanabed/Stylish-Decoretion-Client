// Booking utility functions

/**
 * Validates if a booking ID is in proper format
 * @param {string} bookingId - The booking ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidBookingId = (bookingId) => {
  if (!bookingId || typeof bookingId !== 'string') {
    return false;
  }
  
  // MongoDB ObjectId is 24 characters long (hexadecimal)
  const mongoIdRegex = /^[0-9a-fA-F]{24}$/;
  return mongoIdRegex.test(bookingId);
};

/**
 * Formats booking ID for display
 * @param {string} bookingId - The booking ID to format
 * @param {number} index - Fallback index for generating ID
 * @returns {string} - Formatted booking ID
 */
export const formatBookingId = (bookingId, index = 0) => {
  if (isValidBookingId(bookingId)) {
    return `#${bookingId.substring(0, 8).toUpperCase()}`;
  }
  
  // Generate fallback ID
  return `#BOOK${String(index + 1).padStart(3, '0')}`;
};

/**
 * Gets full booking ID display with additional info
 * @param {string} bookingId - The booking ID
 * @param {number} index - Fallback index
 * @returns {object} - Object with short and full ID
 */
export const getBookingIdDisplay = (bookingId, index = 0) => {
  if (isValidBookingId(bookingId)) {
    return {
      short: `#${bookingId.substring(0, 8).toUpperCase()}`,
      full: bookingId,
      isValid: true
    };
  }
  
  const fallbackId = `BOOK${String(index + 1).padStart(3, '0')}`;
  return {
    short: `#${fallbackId}`,
    full: fallbackId,
    isValid: false
  };
};

/**
 * Validates booking data structure
 * @param {object} booking - The booking object to validate
 * @returns {object} - Validation result with errors
 */
export const validateBookingData = (booking) => {
  const errors = [];
  
  if (!booking) {
    errors.push('Booking data is missing');
    return { isValid: false, errors };
  }
  
  if (!isValidBookingId(booking._id)) {
    errors.push('Invalid booking ID format');
  }
  
  if (!booking.serviceName && !booking.service?.service_name) {
    errors.push('Service name is missing');
  }
  
  if (!booking.userName && !booking.user?.name) {
    errors.push('User name is missing');
  }
  
  if (!booking.date) {
    errors.push('Booking date is missing');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Sanitizes booking data for safe display
 * @param {object} booking - The booking object to sanitize
 * @param {number} index - Fallback index
 * @returns {object} - Sanitized booking data
 */
export const sanitizeBookingData = (booking, index = 0) => {
  if (!booking) {
    return {
      _id: `fallback_${index}`,
      serviceName: 'সার্ভিস নাম নেই',
      userName: 'অজানা গ্রাহক',
      date: new Date().toISOString(),
      status: 'Unknown',
      isPaid: false,
      assignedDecorator: null
    };
  }
  
  return {
    ...booking,
    _id: booking._id || `fallback_${index}`,
    serviceName: booking.serviceName || booking.service?.service_name || 'সার্ভিস নাম নেই',
    userName: booking.userName || booking.user?.name || 'অজানা গ্রাহক',
    userEmail: booking.userEmail || booking.user?.email || 'ইমেইল নেই',
    date: booking.date || new Date().toISOString(),
    status: booking.status || 'Unknown',
    isPaid: Boolean(booking.isPaid),
    assignedDecorator: booking.assignedDecorator || null
  };
};