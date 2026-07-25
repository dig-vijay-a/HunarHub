const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');
const marketplaceRoutes = require('./routes/marketplaceRoutes');
const publicProfileRoutes = require('./routes/publicProfileRoutes');
const publicStatsRoutes = require('./routes/publicStatsRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const adminRoutes = require('./routes/adminRoutes');
const disputeRoutes = require('./routes/disputeRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const chatRoutes = require('./routes/chatRoutes');

// Basic health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'success', message: 'HunarHub API is running smoothly' });
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/marketplace', marketplaceRoutes);
app.use('/api/entrepreneurs', publicProfileRoutes);
app.use('/api/stats', publicStatsRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/disputes', disputeRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/chat', chatRoutes);

// Socket.IO Setup
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log(`User connected: ${socket.id}`);
  
  // User joins their own room (room ID = their User ID)
  socket.on('join_room', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  // Handle sending messages
  socket.on('send_message', async (data) => {
    try {
      const Message = require('./models/Message');
      const msg = await Message.create(data);
      
      // Emit to the receiver
      io.to(data.receiver).emit('receive_message', msg);
      // Emit back to sender
      io.to(data.sender).emit('receive_message', msg);
    } catch (error) {
      console.error('Error saving message:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log(`User disconnected: ${socket.id}`);
  });
});

// Start Server
server.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  await connectDB();
});
