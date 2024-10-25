// middleware/getUserFromToken.js

const jwt = require('jsonwebtoken');

// Middleware to get user from token
const getUserFromToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract the token from the Authorization header
    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    try {
        const decoded = jwt.verify(token, 'your_jwt_secret'); // Replace 'your_jwt_secret' with your JWT secret
        req.user = decoded; // Attach decoded user data to the request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(401).json({ error: 'Invalid or expired token' });
    }
};

module.exports = getUserFromToken;
