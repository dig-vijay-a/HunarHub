const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');
const EntrepreneurProfile = require('./models/EntrepreneurProfile');
const Product = require('./models/Product');
const Service = require('./models/Service');
const Category = require('./models/Category');
const bcrypt = require('bcryptjs');

dotenv.config();

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hunarhub');
    console.log('MongoDB Connected for Seeding...');

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    // Clear existing
    await User.deleteMany();
    await EntrepreneurProfile.deleteMany();
    await Product.deleteMany();
    await Service.deleteMany();
    await Category.deleteMany();

    // 1. Categories
    const cat1 = await Category.create({ name: 'Pottery' });
    const cat2 = await Category.create({ name: 'Tailoring' });
    const cat3 = await Category.create({ name: 'Cobbler' });

    // 2. Admin User
    await User.create({
      name: 'Admin User',
      email: 'admin@hunarhub.com',
      password: hashedPassword,
      role: 'admin'
    });

    // 3. Customer
    const customer = await User.create({
      name: 'Regular Customer',
      email: 'customer@hunarhub.com',
      password: hashedPassword,
      role: 'customer'
    });

    // 4. Entrepreneur 1
    const entUser1 = await User.create({
      name: 'Ravi the Potter',
      email: 'ravi@hunarhub.com',
      password: hashedPassword,
      role: 'entrepreneur'
    });

    const entProfile1 = await EntrepreneurProfile.create({
      user: entUser1._id,
      bio: 'I make beautiful handcrafted clay pots and ceramics with a modern twist.',
      category: cat1.name,
      location: 'New Delhi',
      skills: ['Clay throwing', 'Glazing', 'Kiln firing'],
      imageUrl: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?w=500',
      isAvailable: true
    });

    // 5. Products & Services for Ent 1
    await Product.create({
      entrepreneur: entProfile1._id,
      name: 'Handpainted Clay Vase',
      description: 'A beautiful 10-inch vase for your living room.',
      price: 25,
      category: cat1.name,
      imageUrl: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=500'
    });

    await Service.create({
      entrepreneur: entProfile1._id,
      name: 'Custom Pottery Class',
      description: 'A 2-hour 1-on-1 session on the pottery wheel.',
      basePrice: 50,
      duration: '2 hours',
      imageUrl: 'https://images.unsplash.com/photo-1565193566173-7a0cb3d16233?w=500'
    });

    // 6. Entrepreneur 2
    const entUser2 = await User.create({
      name: 'Sunita the Tailor',
      email: 'sunita@hunarhub.com',
      password: hashedPassword,
      role: 'entrepreneur'
    });

    const entProfile2 = await EntrepreneurProfile.create({
      user: entUser2._id,
      bio: 'Expert seamstress with 20 years of experience making custom dresses and alterations.',
      category: cat2.name,
      location: 'Mumbai',
      skills: ['Hemming', 'Custom Dresses', 'Embroidery'],
      imageUrl: 'https://images.unsplash.com/photo-1556228578-8d89cb7ba823?w=500',
      isAvailable: true
    });

    await Service.create({
      entrepreneur: entProfile2._id,
      name: 'Dress Alterations',
      description: 'Custom fitting and hemming for your dresses.',
      basePrice: 30,
      duration: '1 hour',
      imageUrl: 'https://images.unsplash.com/photo-1512438258663-ce20ecf383eb?w=500'
    });

    console.log('Dummy Data Seeded Successfully!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDB();
