import User from '../models/User.model.js';
import Subscription from '../models/subscription.model.js';
import SupportTicket from '../models/supportTicket.model.js';

export async function listUsers(req, res) {
  const users = await User.find({}).sort({ createdAt: -1 });
  res.json(users);
}

export async function getUser(req, res) {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

export async function updateUser(req, res) {
  const { name, phone, isVerified } = req.body;
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: { name, phone, isVerified } },
    { new: true, runValidators: true }
  );
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json(user);
}

export async function deleteUser(req, res) {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ success: true });
}

export async function listUserSubscriptions(req, res) {
  const targetUser = await User.findById(req.params.id);
  if (!targetUser) return res.status(404).json({ message: 'User not found' });
  const filter = { user: targetUser._id };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category.toLowerCase();
  const subs = await Subscription.find(filter).sort({ nextChargeDate: 1 });
  res.json(subs);
}

// List ALL subscriptions across users (admin overview)
export async function listAllSubscriptions(req, res) {
  const filter = {};
  if (req.query.status) filter.status = req.query.status;
  if (req.query.category) filter.category = req.query.category.toLowerCase();
  const subs = await Subscription.find(filter)
    .populate('user', 'email name')
    .sort({ nextChargeDate: 1 });
  res.json(subs);
}

export async function listSupportTickets(req, res) {
  const { status } = req.query;
  const filter = {};
  if (status) filter.status = status;
  const tickets = await SupportTicket.find(filter).sort({ createdAt: -1 });
  res.json(tickets);
}

export async function resolveSupportTicket(req, res) {
  const { id } = req.params;
  const ticket = await SupportTicket.findByIdAndUpdate(id, { $set: { status: 'resolved' } }, { new: true });
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
  res.json(ticket);
}

export async function getSupportTicketHistory(req, res) {
  const { id } = req.params;
  const ticket = await SupportTicket.findById(id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
  res.json(ticket);
}

export async function replySupportTicket(req, res) {
  const { id } = req.params;
  const { reply } = req.body;
  
  if (!reply || String(reply).trim().length === 0) {
    return res.status(400).json({ message: 'Reply message is required' });
  }
  
  const ticket = await SupportTicket.findById(id);
  if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
  
  const nodemailer = await import('nodemailer');
  const { MAIL_HOST, MAIL_PORT, MAIL_USER, MAIL_PASS, MAIL_FROM } = process.env;
  
  if (!MAIL_HOST || !MAIL_PORT || !MAIL_USER || !MAIL_PASS) {
    return res.status(500).json({ message: 'Email configuration is missing' });
  }
  
  const transporter = nodemailer.default.createTransport({
    host: MAIL_HOST,
    port: Number(MAIL_PORT),
    secure: Number(MAIL_PORT) === 465,
    auth: { user: MAIL_USER, pass: MAIL_PASS },
  });
  
  const from = MAIL_FROM
  
  try {
    await transporter.sendMail({
      from,
      to: ticket.email,
      subject: `Re: Your Support Request - ${ticket.message.substring(0, 50)}...`,
      html: `<!DOCTYPE html><html><body style="font-family:Arial,Helvetica,sans-serif;background:#f5f7fa;padding:0;margin:0;">
      <div style="max-width:640px;margin:24px auto;background:#ffffff;padding:32px 40px;border-radius:12px;border:1px solid #e5e7eb;">
      <h1 style="margin:0 0 16px;font-size:22px;color:#111827;">Support Team Response</h1>
      <p style="line-height:1.5;font-size:14px;">Hi ${ticket.name || 'there'},</p>
      <p style="line-height:1.5;font-size:14px;">Thank you for reaching out to us. Here's our response to your message:</p>
      <div style="background:#f9fafb;border-left:3px solid #3b82f6;padding:16px;margin:16px 0;">
        <p style="margin:0;font-size:13px;color:#6b7280;"><strong>Your message:</strong></p>
        <p style="margin:8px 0 0;font-size:14px;color:#374151;">${ticket.message}</p>
      </div>
      <div style="background:#f0f9ff;border-left:3px solid #0ea5e9;padding:16px;margin:16px 0;">
        <p style="margin:0;font-size:13px;color:#0c4a6e;"><strong>Our response:</strong></p>
        <p style="margin:8px 0 0;font-size:14px;color:#0c4a6e;white-space:pre-wrap;">${String(reply).trim()}</p>
      </div>
      <p style="font-size:12px;color:#9ca3af;margin-top:32px;">Subscription Tracker Support • If you have more questions, feel free to reply to this email.</p>
      </div></body></html>`
    });
    
    // Save reply to database
    ticket.replies.push({
      sender: 'admin',
      message: String(reply).trim(),
      timestamp: new Date()
    });
    await ticket.save();
    
    res.json({ success: true, message: 'Reply sent successfully' });
  } catch (error) {
    console.error('Failed to send reply email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
}
