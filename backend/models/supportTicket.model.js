import mongoose from 'mongoose';

const SupportTicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, default: '' },
  email: { type: String, required: true, index: true },
  message: { type: String, required: true, maxlength: 5000 },
  status: { type: String, enum: ['open','resolved'], default: 'open', index: true },
  replies: [{
    sender: { type: String, enum: ['admin', 'user'], required: true },
    message: { type: String, required: true, maxlength: 5000 },
    timestamp: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export default mongoose.model('SupportTicket', SupportTicketSchema);
