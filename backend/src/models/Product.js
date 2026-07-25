const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  entrepreneur: { type: mongoose.Schema.Types.ObjectId, ref: 'EntrepreneurProfile', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String },
  imageUrl: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
