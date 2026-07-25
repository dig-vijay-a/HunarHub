const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'EntrepreneurProfile', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  basePrice: { type: Number, required: true },
  duration: { type: String },
  imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
