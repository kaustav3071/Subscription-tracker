import mongoose from 'mongoose';

const SupportTicketSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  name: { type: String, default: '' },
  email: { type: String, required: true, index: true },
  message: { type: String, required: true, maxlength: 5000 },
  status: { type: String, enum: ['open','resolved'], default: 'open', index: true },
}, { timestamps: true });

export default mongoose.model('SupportTicket', SupportTicketSchema);
