const User = require("../models/User");
const { sendOTPMessage } = require("../utils/twilioHelper");
const { generateOTP } = require("../utils/otpGenerator");
const ipinfo = require("ipinfo");

async function sendOTP(req, res) {
  const { username, password, phoneNumber } = req.body;
  const userIP = req.ip;
  console.log("Client IP Address:", userIP);

  try {
    const ipDetails = await getIPDetails(userIP);

    if (ipDetails) {
      const existingUser = await User.findOne({ phoneNumber });

      if (existingUser) {
        return res
          .status(400)
          .json({ message: "User already registered with same IP address" });
      }

      const otp = generateOTP();

      const newUser = new User({
        username,
        password,
        phoneNumber,
        otp,
        ipAddress: userIP,
      });

      await newUser.save();

      await sendOTPMessage(phoneNumber, otp);

      res.status(200).json({ message: "OTP sent successfully." });
    } else {
      res.status(400).json({ message: "Invalid IP address." });
    }
  } catch (error) {
    console.error("Error in sendOTP:", error);
    res.status(500).json({ message: "something went wrong" });
  }
}

async function validateOTP(req, res) {
  const { phoneNumber, otp } = req.body;

  try {
    const user = await User.findOne({ phoneNumber });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (otp === user.otp) {
      res.status(200).json({ message: "OTP is valid. User registered." });
    } else {
      res.status(400).json({ message: "Invalid OTP." });
    }
  } catch (error) {
    console.error("Error in validateOTP:", error);
    res.status(500).json({ message: "Internal server error." });
  }
}

async function getIPDetails(ipAddress) {
  return new Promise((resolve, reject) => {
    ipinfo(ipAddress, (err, ipDetails) => {
      if (err) {
        console.error("Error retrieving IP information:", err);
        resolve(null);
      } else {
        resolve(ipDetails);
      }
    });
  });
}

module.exports = { sendOTP, validateOTP };
