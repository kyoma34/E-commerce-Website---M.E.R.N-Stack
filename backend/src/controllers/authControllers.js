import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import UserModel from '../models/User.js';

// helper — generates a signed JWT
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });

// ── POST /api/auth/register ──────────────────────────────
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const existing = await UserModel.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'Email already registered' });

    const hashed = await bcrypt.hash(password, 10);

    const user = await UserModel.create({
      firstName,
      lastName,
      email,
      password: hashed,
    });

    res.status(201).json({
      _id:       user._id,
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email,
      isAdmin:   user.isAdmin,
      token:     generateToken(user._id),
    });
  } catch (error) {
    console.error('Error in register:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── POST /api/auth/login ─────────────────────────────────
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password are required' });

    const user = await UserModel.findOne({ email });
    if (!user)
      return res.status(401).json({ message: 'Invalid email or password' });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(401).json({ message: 'Invalid email or password' });

    res.status(200).json({
      _id:       user._id,
      firstName: user.firstName,
      lastName:  user.lastName,
      email:     user.email,
      isAdmin:   user.isAdmin,
      token:     generateToken(user._id),
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ── GET /api/auth/me ─────────────────────────────────────
export const getMe = async (req, res) => {
  // req.user is set by the protect middleware
  res.status(200).json(req.user);
};