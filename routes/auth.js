const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authenticateToken = require('../middlewares/authMiddleware'); // Add this line to require jsonwebtoken
const jwt = require('jsonwebtoken');


router.post('/', authenticateToken, async (req, res) => {
  try {
      const task = new Task({
          user: req.user.id, // Attach user ID from the decoded token
          description: req.body.description
      });

      await task.save();
      res.status(201).json({ message: 'Task created successfully', task });
  } catch (error) {
      console.error('Error creating task:', error);
      res.status(500).json({ error: 'Server error' });
  }
});

router.post('/signup', async (req, res) => {
  console.log(req.body); // Should now contain the parsed JSON data
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    user = new User({ username, email, password });
    await user.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ error: 'Error creating user' });
  }
});

// Use the authenticateToken middleware for the login route
// Login route in auth.js
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
  }

  try {
      const user = await User.findOne({ email });

      if (!user) {
          return res.status(400).json({ error: 'User not found' });
      }

      const isMatch = (password === user.password); // Use bcrypt for hashing in production

      if (!isMatch) {
          return res.status(400).json({ error: 'Invalid credentials' });
      }

      // Create a JWT token
      const token = jwt.sign({ _id: user._id }, 'your-secret-key', { expiresIn: '1h' });

      // Set the token as a cookie
      res.cookie('token', token, { httpOnly: true });
      res.status(200).json({ message: 'Login successful' });
  } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Server error' });
  }
});


router.get('/protected', authenticateToken, (req, res) => {
    res.status(200).json({ message: 'This is a protected route', user: req.user });
});


module.exports = router;