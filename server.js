const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const path = require('path'); // Added path module

const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');

const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'views'))); // Static file serving

// MongoDB connection
mongoose.connect('mongodb+srv://rickyoinam9:root@todolist.d0o0l.mongodb.net/')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.log('Failed to connect to MongoDB', err));

// Redirect route for the root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'signup.html')); // Serve signup.html directly
});

// Other routes
app.use('/auth', authRoutes);
app.use('/tasks', taskRoutes);

// Start server
const PORT = 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
