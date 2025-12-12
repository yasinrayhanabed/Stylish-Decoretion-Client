// Booking utility functions

/**
 * Validates if a booking ID is in proper format
 * @param {string} bookingId - The booking ID to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const isValidBookingId = (bookingId) => {
  if (!bookingId) {
    return false;
  }
  
  // Accept any non-empty string as valid
  return String(bookingId).length > 0;
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
  
  // Remove strict ID validation to prevent errors
  
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
      serviceName: 'Service N/A',
      userName: 'Unknown User',
      date: new Date().toISOString(),
      status: 'Unknown',
      isPaid: false,
      assignedDecorator: null
    };
  }
  
  return {
    ...booking,
    _id: booking._id || `fallback_${index}`,
    serviceName: booking.serviceName || booking.service?.service_name || 'Service N/A',
    userName: booking.userName || booking.user?.name || 'Unknown User',
    userEmail: booking.userEmail || booking.user?.email || 'No Email',
    date: booking.date || new Date().toISOString(),
    status: booking.status || 'Unknown',
    isPaid: Boolean(booking.isPaid),
    assignedDecorator: booking.assignedDecorator || null
  };
};