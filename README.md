# 🛒 E-commerce Website — MERN Stack

A full stack e-commerce web application built with the MERN stack, featuring product listings, a shopping cart, and user authentication.

## 🚀 Features

- 🛍️ Browse and search products by category
- 🛒 Add to cart and manage quantities
- 🔐 User authentication (register / login / logout)
- 👤 User profile and order history
- 🔧 Admin panel for product management (add, edit, delete)
- 💳 Checkout flow

## 🛠️ Tech Stack

**Frontend:** React.js, CSS  
**Backend:** Node.js, Express.js  
**Database:** MongoDB + Mongoose  
**Auth:** JWT (JSON Web Tokens)  
**Tools:** Postman, Git, VS Code

## ⚙️ Installation

```bash
# Clone the repository
git clone https://github.com/kyoma34/E-commerce-Website---M.E.R.N-Stack.git
cd E-commerce-Website---M.E.R.N-Stack

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

## 🔧 Environment Variables

Create a `.env` file in the `/backend` folder:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## ▶️ Running the App

```bash
# Start backend (from /backend)
npm run dev

# Start frontend (from /frontend)
npm start
```

## 📁 Project Structure

```
E-commerce-MERN/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── redux/
    │   └── App.js
    └── public/
```

---
> Built with the MERN Stack 🟢
