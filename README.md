# HunarHub ✨

HunarHub is a modern, premium web platform designed to empower local micro-entrepreneurs, artisans, and skilled workers by giving them a beautiful digital storefront to connect directly with their community. 

## 🚀 Key Features

### 1. Robust Authentication & Roles
- **Three distinct roles:** Customer, Entrepreneur (Artisan), and Admin.
- Secure registration and login using encrypted passwords (`bcryptjs`) and secure sessions (`JWT`).

### 2. Live Real-Time Chat 💬
- Integrated **Socket.IO** allowing customers and artisans to message each other instantly.
- A dedicated `/messages` interface with a contact sidebar and real-time typing/delivery.
- Chat history is securely saved to the database.

### 3. Artisan Marketplace & Profiles
- Customers can easily browse products and services offered by local artisans.
- Artisans get a premium public profile page showcasing their verified status, bio, skills, services, products, and customer reviews.
- Dynamic filtering by category, location, and price.

### 4. Comprehensive Admin Dashboard
- **Control Center:** View live platform statistics (total users, artisans, and satisfaction rates).
- **Verification System:** Easily verify authentic entrepreneurs (granting them a Verified badge) or remove bad actors from the platform entirely.
- Manage marketplace categories dynamically.

### 5. Premium UI/UX 🎨
- Built with **Next.js** and **Tailwind CSS**.
- Features modern design aesthetics: split-screen authentication layouts, glassmorphism, dynamic scrolling, hover animations, and sleek horizontal tabs.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js (React), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB, Mongoose
- **Real-Time:** Socket.IO
- **Security:** bcryptjs, jsonwebtoken (JWT)

---

## ⚙️ Setup & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) installed
- [MongoDB](https://www.mongodb.com/) running locally or a MongoDB URI

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up your `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_key
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open your browser and visit `http://localhost:3000`.

---

## 🛡️ License
This project was built as part of the Unified Mentor Internship.
