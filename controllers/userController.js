import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { User } from '../models/user.js';
import jwt from 'jsonwebtoken';

const isProduction = process.env.NODE_ENV === 'production';

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isPasswordMatch = bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (!user.isVerified) {
      return res
        .status(403)
        .send('Please verify your email before logging in.');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res
      .cookie('token', token, {
        httpOnly: true,
        sameSite: isProduction ? 'none' : 'strict',
        secure: isProduction,
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: 'Login successful',
        user: {
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Please send all credentials' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);
    const verificationToken = crypto.randomBytes(32).toString('hex');

    const user = new User({
      name,
      email,
      password: hashPassword,
      isVerified: false,
      verificationToken: verificationToken,
    });
    const savedUser = await user.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER_verification,
        pass: process.env.EMAIL_PASS_verification,
      },
    });

    const verificationUrl = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

    try {
      await transporter.sendMail({
        from: `"YourApp Support" <${process.env.EMAIL_USER_verification}>`,
        to: email,
        subject: 'Verify your email for YourApp',
        html: `<p>Hi ${name},</p><p>Please click the link below to verify your email:</p><a href="${verificationUrl}">Verify My Email</a>`,
      });
      console.log('Verification email sent to:', email);
    } catch (err) {
      console.error('Email sending failed:', err);
    }

    res.status(201).json({
      message: 'Please check your email to verify your account.',
      user: {
        name: savedUser.name,
        email: savedUser.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const logoutUser = (req, res) => {
  try {
    res
      .cookie('token', '', {
        httpOnly: true,
        sameSite: 'strict',
        expires: new Date(0),
        path: '/',
      })
      .status(200)
      .json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};

export const getUser = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const user = await User.findOne({ _id: req.user.id }).select('-password');
    if (!user) {
      return res.status(400).json({ message: 'User does not exist' });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });
    if (!user)
      return res.status(400).json({ message: 'Invalid or expired link.' });

    user.isVerified = true;
    user.verificationToken = undefined;
    await user.save();

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '30d',
    });

    res
      .cookie('token', jwtToken, {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 30 * 24 * 60 * 60 * 1000,
      })
      .status(200)
      .json({
        message: 'Email verified successfully and logged in!',
        user: {
          name: user.name,
          email: user.email,
        },
      });
  } catch (error) {
    res.status(500).json({ message: error.message || 'Internal Server Error' });
  }
};
