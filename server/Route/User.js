const express = require("express");
const router = express.Router();

const {
  login,
  signup,
  sendotp,
  changePassword,
} = require("../Controller/Auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../Controller/ResetPassword");

const { auth } = require("../Middleware/Auth");

router.post("/login", login);

router.post("/signup", signup);

router.post("/sendotp", sendotp);

router.post("/changepassword", auth, changePassword);

router.post("/reset-password-token", resetPasswordToken);

router.post("/reset-password", resetPassword);

module.exports = router;
