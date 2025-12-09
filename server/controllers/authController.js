const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

  
const sendTokenResponse = (user, res) => {
  const token = createToken(user._id);

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  return res.json({
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
  });
};


exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: 'All fields are required' });

    const existing = await User.findOne({ email });
    if (existing)
      return res.status(400).json({ message: 'Email already registered' });

    const user = await User.create({ name, email, password });

    sendTokenResponse(user, res);
  } catch (err) {
    next(err);
  }
};


exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: 'Email and password required' });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    sendTokenResponse(user, res);
  } catch (err) {
    next(err);
  }
};


exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};


// GET /auth/me - return current user based on JWT cookie/header
exports.getMe = async (req, res, next) => {
  try {
    // req.user is set by protect middleware
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
};
