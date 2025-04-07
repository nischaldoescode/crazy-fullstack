import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { asyncHandler } from '../utils/AsyncHandler.js';

import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import UserModel from '../models/userModel.js';
import dotenv from 'dotenv';
dotenv.config();



const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d"
  });
};

console.log("EMAIL:", process.env.EMAIL);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  },
});


const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email } = req.body;
  console.log(firstName)
  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    throw new ApiError(400, 'User already exists');
  }

  const user = await UserModel.create({ firstName, lastName, email });

  res.status(201).json(new ApiResponse(201, user, 'User registered successfully'));
});


const loginUser = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await UserModel.findOne({ email });
  if (!user) {
    throw new ApiError(400, 'User not found');
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  user.verificationCode = code;
  user.codeExpiresAt = Date.now() + 10 * 60 * 1000;
  await user.save();

  await transporter.sendMail({
    from: process.env.EMAIL,
    to: email,
    subject: 'Your Login Code',
    text: `Your verification code is: ${code}`,
  });

  res.status(200).json(new ApiResponse(200, user, 'Verification code sent to email'));
});


const checkUserExists = asyncHandler(async (req, res) => {
  const { email, code } = req.body;

  const user = await UserModel.findOne({ email });

  if (
    !user ||
    user.verificationCode !== code ||
    Date.now() > user.codeExpiresAt
  ) {
    throw new ApiError(400, 'Invalid or expired verification code');
  }


  user.verificationCode = null;
  user.codeExpiresAt = null;
  await user.save();

  const token = generateToken(user._id);
  const loggedInUser = await UserModel.findById(user._id)
  loggedInUser.token = token;

  res.status(200).json(new ApiResponse(200, { user: loggedInUser }, 'Login successful'));
});



const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (
    email === process.env.ADMIN_EMAIL &&
    password === process.env.ADMIN_PASSWORD
  ) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET);
    res.status(200).json(new ApiResponse(200, { token }, 'Admin login successful'));
  } else {
    throw new ApiError(401, 'Invalid credentials');
  }
});

export {
  loginUser,
  registerUser,
  adminLogin,
  checkUserExists,
};
