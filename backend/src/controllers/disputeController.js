const Dispute = require('../models/Dispute');

exports.createDispute = async (req, res) => {
  try {
    const { entrepreneurId, orderType, orderId, reason } = req.body;
    const dispute = new Dispute({
      customer: req.user._id,
      entrepreneur: entrepreneurId,
      orderType,
      orderId,
      reason
    });
    const saved = await dispute.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDisputes = async (req, res) => {
  try {
    const disputes = await Dispute.find().populate('customer', 'name email').populate({
      path: 'entrepreneur',
      populate: { path: 'user', select: 'name' }
    });
    res.json(disputes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.resolveDispute = async (req, res) => {
  try {
    const dispute = await Dispute.findById(req.params.id);
    if(!dispute) return res.status(404).json({message: 'Not found'});
    dispute.status = 'resolved';
    await dispute.save();
    res.json(dispute);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
