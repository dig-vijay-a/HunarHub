const mongoose = require('mongoose');

const disputeSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'EntrepreneurProfile', required: true },
  orderType: { type: String, enum: ['Order', 'ServiceRequest'], required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, required: true },
  reason: { type: String, required: true },
  status: { type: String, enum: ['open', 'resolved'], default: 'open' }
}, { timestamps: true });

module.exports = mongoose.model('Dispute', disputeSchema);
