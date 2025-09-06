import UserModel from "../models/User.model.js";
import { validationResult } from 'express-validator';
import BlacklistToken from '../models/blacklistToken.model.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { notifyAdminNewUser } from '../services/notification.service.js';


dotenv.config();

function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) return null;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}

function buildVerifyLink(token) {
  const base = process.env.CLIENT_URL || 'http://localhost:5000';
  return `${base}/users/verify-email?token=${token}`;
}

export const registerUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password, name, phone } = req.body;

    const exists = await UserModel.findOne({ email });
    if (exists) return res.status(409).json({ message: 'Email already in use' });

    // Create verification token (store hashed; send raw)
    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');

    const user = await UserModel.create({ email, password, name, phone, emailVerificationToken: tokenHash });

    const verifyLink = buildVerifyLink(rawToken);
    const transporter = getTransport();
    if (transporter) {
      const from = process.env.MAIL_FROM || 'no-reply@example.com';
      await transporter.sendMail({
        from,
        to: user.email,
        subject: 'Verify your email',
        html: `<p>Hi ${user.name || ''},</p><p>Please verify your email by clicking the link below:</p><p><a href="${verifyLink}">Verify Email</a></p>`,
      });
    } else {
      // Fallback: log link for dev
      console.log('Verification link:', verifyLink);
    }

  const token = user.generateAuthToken();
  const extra = process.env.NODE_ENV === 'production' ? {} : { verifyToken: rawToken };
  res.status(201).json({ token, user, ...extra });
  // Fire-and-forget admin notification
  notifyAdminNewUser(user).catch(() => {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ message: 'Token is required' });
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

    const user = await UserModel.findOne({ emailVerificationToken: tokenHash });
    if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

  user.isVerified = true;
  user.emailVerificationToken = undefined;
  await user.save();
  res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (user.isVerified) return res.status(400).json({ message: 'Already verified' });

    const rawToken = crypto.randomBytes(32).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    user.emailVerificationToken = tokenHash;
    await user.save();

    const verifyLink = buildVerifyLink(rawToken);
    const transporter = getTransport();
    if (transporter) {
      const from = process.env.MAIL_FROM || 'no-reply@example.com';
      await transporter.sendMail({
        from,
        to: user.email,
        subject: 'Verify your email',
        html: `<p>Click to verify: <a href="${verifyLink}">${verifyLink}</a></p>`,
      });
    } else {
      console.log('Verification link:', verifyLink);
    }
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const loginUser = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email }).select('+password');
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const valid = await user.comparePassword(password);
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' });
    if (!user.isVerified) {
      return res.status(403).json({ message: 'Please verify your email' });
    }
    const token = user.generateAuthToken();
    res.json({ token, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const logoutUser = async (req, res) => {
  try {
    // Extract current token
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (!token) return res.status(400).json({ message: 'Token missing' });
    const decoded = jwt.decode(token);
    const userId = decoded?._id || decoded?.id || req.user?.id;
    await BlacklistToken.create({ token, userId });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMe = async (req, res) => {
  try {
    const authId = req.user?.id;
    if (!authId) return res.status(401).json({ message: 'Unauthorized' });
    const paramId = req.params?.id;
    const targetId = paramId || authId;
    if (paramId && paramId !== authId) {
      return res.status(403).json({ message: 'Forbidden' });
    }
    const user = await UserModel.findById(targetId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// export const UpdateUser = async (req, res) => {
//     try {