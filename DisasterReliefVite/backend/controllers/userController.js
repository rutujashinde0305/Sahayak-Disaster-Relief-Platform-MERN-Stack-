
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const getUsers = async (req, res) => {
  const users = await User.find();
  res.json(users);
};

export const createUser = async (req, res) => {
  try {
    console.log('Incoming registration payload:', req.body);
    const { name, email, password, role } = req.body;
    // Validate required fields
    if (!name || !email || !password || !role) {
      console.log('Validation failed: missing required fields');
      return res.status(400).json({ error: 'Missing required fields: name, email, password, role.' });
    }
    // Validate role
    if (!['admin', 'volunteer', 'victim'].includes(role)) {
      console.log('Validation failed: invalid role', role);
      return res.status(400).json({ error: 'Invalid role. Must be admin, volunteer, or victim.' });
    }
    // Check for existing email
    const existing = await User.findOne({ email });
    if (existing) {
      console.log('Validation failed: email already registered', email);
      return res.status(400).json({ error: 'Email already registered.' });
    }
    // Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ ...req.body, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: 'User registered successfully', user });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(400).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt for:', email);
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid email or password' });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid email or password' });
    res.json({ message: 'Login successful', user });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

export const updateUser = async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
};

export const deleteUser = async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json({ message: 'User deleted' });
};
