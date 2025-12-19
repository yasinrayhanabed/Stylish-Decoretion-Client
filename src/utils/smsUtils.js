import { toast } from "react-toastify";

// This is a mock function. In a real app, it would call an SMS gateway API.
export const sendSMS = async (phoneNumber, message, type = "mock") => {
  console.log(`--- MOCK SMS SENT ---`);
  console.log(`To: ${phoneNumber}`);
  console.log(`Message: ${message}`);
  console.log(`Type: ${type}`);
  console.log(`---------------------`);

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  toast.info(`(Mock) SMS sent to ${phoneNumber}`);
  return { success: true, messageId: `mock_${Date.now()}` };
};

export const smsTemplates = {
  bookingConfirmation: (serviceName, date, amount) =>
    `Your booking for ${serviceName} on ${date} is confirmed! Total: ৳${amount}. Thank you for choosing StyleDecor.`,
  serviceUpdate: (serviceName) =>
    `Update from StyleDecor: There's a new update regarding the ${serviceName} service. Please check our website for details.`,
  couponCode: (code, discount, expiry) =>
    `Special Offer! Use code ${code} to get ${discount}% off on your next booking. Valid until ${expiry}.`,
};
