require("dotenv").config();

const twilio = require("twilio")(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

async function sendOTPMessage(phoneNumber, otp) {
  try {
    await twilio.messages.create({
      body: `Your OTP is: ${otp}. Please enter this OTP to register.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });
  } catch (error) {
    console.error("Error sending OTP message:", error);
    throw error;
  }
}

module.exports = { sendOTPMessage };
