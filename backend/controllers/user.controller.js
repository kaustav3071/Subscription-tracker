import UserModel from "../models/User.model.js";
import { validationResult } from 'express-validator';
import BlacklistToken from '../models/blacklistToken.model.js';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { notifyAdminNewUser, notifyAdminSupportMessage } from '../services/notification.service.js';
import SupportTicket from '../models/supportTicket.model.js';


dotenv.config();

function getTransport() {
  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS } = process.env;
  if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS) return null;
  return nodemailer.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    secure: Number(MAIL_PORT) === 465,
    auth: { user: MAIL_USER, pass: MAIL_PASS },
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
        html: `<!DOCTYPE html><html><body style="font-family:Arial,Helvetica,sans-serif;background:#f5f7fa;padding:0;margin:0;">
        <div style="max-width:640px;margin:24px auto;background:#ffffff;padding:32px 40px;border-radius:12px;border:1px solid #e5e7eb;">
        <h1 style="margin:0 0 16px;font-size:22px;color:#111827;">Confirm your email</h1>
        <p style="line-height:1.5;font-size:14px;">Hi ${user.name || ''},</p>
        <p style="line-height:1.5;font-size:14px;">Thanks for signing up. Please confirm your email so we can activate your account.</p>
        <p style="margin:24px 0;"><a href="${verifyLink}" style="background:#2563eb;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:600;display:inline-block;">Verify Email</a></p>
        <p style="font-size:12px;color:#6b7280;">If the button does not work, copy and paste this link:<br/><span style="word-break:break-all;">${verifyLink}</span></p>
        <p style="font-size:12px;color:#9ca3af;margin-top:32px;">Subscription Tracker • If you didn’t create this account, ignore this email.</p>
        </div></body></html>`
      });
    } else {
      console.log('Verification link:', verifyLink);
    }

  const token = user.generateAuthToken();
  const extra = process.env.NODE_ENV === 'production' ? {} : { verifyToken: rawToken };
  res.status(201).json({ token, user, ...extra });
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
        subject: 'Verify your email (reminder)',
        html: `<!DOCTYPE html><html><body style="font-family:Arial,Helvetica,sans-serif;background:#f5f7fa;padding:0;margin:0;">
        <div style="max-width:640px;margin:24px auto;background:#ffffff;padding:32px 40px;border-radius:12px;border:1px solid #e5e7eb;">
        <h1 style="margin:0 0 16px;font-size:22px;color:#111827;">Just one more step</h1>
        <p style="line-height:1.5;font-size:14px;">Hi ${user.name || ''},</p>
        <p style="line-height:1.5;font-size:14px;">Please verify your email to finish activating your account.</p>
        <p style="margin:24px 0;"><a href="${verifyLink}" style="background:#2563eb;color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:600;display:inline-block;">Verify Email</a></p>
        <p style="font-size:12px;color:#6b7280;">Link (copy if needed):<br/><span style="word-break:break-all;">${verifyLink}</span></p>
        <p style="font-size:12px;color:#9ca3af;margin-top:32px;">Subscription Tracker • If you didn’t request this, you can ignore it.</p>
        </div></body></html>`
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

export const sendSupportMessage = async (req, res) => {
  try {
    const authId = req.user?.id;
    if (!authId) return res.status(401).json({ message: 'Unauthorized' });
    const user = await UserModel.findById(authId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    const { message } = req.body || {};
    if (!message || String(message).trim().length === 0) {
      return res.status(400).json({ message: 'Message is required' });
    }
    const msg = String(message).trim();
    // persist ticket
    const ticket = await SupportTicket.create({ userId: user._id, name: user.name || '', email: user.email, message: msg });
    // email admin (best-effort)
    await notifyAdminSupportMessage(user, msg).catch(()=>{});
    res.json({ success: true, ticketId: ticket._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserSupportTickets = async (req, res) => {
  try {
    const authId = req.user?.id;
    if (!authId) return res.status(401).json({ message: 'Unauthorized' });
    
    const { status } = req.query;
    const filter = { userId: authId };
    if (status) filter.status = status;
    
    const tickets = await SupportTicket.find(filter).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getUserSupportTicketHistory = async (req, res) => {
  try {
    const authId = req.user?.id;
    if (!authId) return res.status(401).json({ message: 'Unauthorized' });
    
    const { id } = req.params;
    const ticket = await SupportTicket.findOne({ _id: id, userId: authId });
    
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

export const resolveUserSupportTicket = async (req, res) => {
  try {
    const authId = req.user?.id;
    if (!authId) return res.status(401).json({ message: 'Unauthorized' });
    
    const { id } = req.params;
    const ticket = await SupportTicket.findOneAndUpdate(
      { _id: id, userId: authId },
      { $set: { status: 'resolved' } },
      { new: true }
    );
    
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get notification preferences
export const getNotificationPreferences = async (req, res) => {
  try {
    const authId = req.user?.id;
    if (!authId) return res.status(401).json({ message: 'Unauthorized' });
    
    const user = await UserModel.findById(authId).select('notifications');
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json(user.notifications || {});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update notification preferences
export const updateNotificationPreferences = async (req, res) => {
  try {
    const authId = req.user?.id;
    if (!authId) return res.status(401).json({ message: 'Unauthorized' });
    
    const { renewalReminders, spendingAlerts, reminderDaysBefore, spendingThreshold, currency } = req.body;
    
    const updateFields = {};
    if (typeof renewalReminders === 'boolean') updateFields['notifications.renewalReminders'] = renewalReminders;
    if (typeof spendingAlerts === 'boolean') updateFields['notifications.spendingAlerts'] = spendingAlerts;
    if (typeof reminderDaysBefore === 'number' && reminderDaysBefore >= 1 && reminderDaysBefore <= 30) {
      updateFields['notifications.reminderDaysBefore'] = reminderDaysBefore;
    }
    if (typeof spendingThreshold === 'number' && spendingThreshold >= 0) {
      updateFields['notifications.spendingThreshold'] = spendingThreshold;
    }
    if (currency && typeof currency === 'string') {
      updateFields['notifications.currency'] = currency.toUpperCase();
    }
    
    const user = await UserModel.findByIdAndUpdate(
      authId,
      { $set: updateFields },
      { new: true }
    ).select('notifications');
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    
    res.json({ success: true, notifications: user.notifications });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

