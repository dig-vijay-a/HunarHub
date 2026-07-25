const Message = require('../models/Message');
const User = require('../models/User');

// Fetch chat history between logged-in user and another user
exports.getChatHistory = async (req, res) => {
  try {
    const userId1 = req.user._id; // Logged in user
    const userId2 = req.params.userId; // The other user

    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 }
      ]
    }).sort({ createdAt: 1 }); // Oldest to newest

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Fetch all users the logged-in user has chatted with
exports.getChatContacts = async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Find all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    }).sort({ createdAt: -1 });

    // Extract unique user IDs
    const contactIds = new Set();
    messages.forEach(msg => {
      if (msg.sender.toString() !== userId.toString()) contactIds.add(msg.sender.toString());
      if (msg.receiver.toString() !== userId.toString()) contactIds.add(msg.receiver.toString());
    });

    // Fetch user details for those contacts
    const contacts = await User.find({ _id: { $in: Array.from(contactIds) } }).select('name email role');
    
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
