const express = require("express");
const router = express.Router();
const { sendOTP, validateOTP } = require("../controllers/userController");

router.post("/send-otp", sendOTP);
router.post("/validate-otp", validateOTP);

module.exports = router;
