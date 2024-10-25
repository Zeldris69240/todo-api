const jwt = require('jsonwebtoken');

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    // Check for token in cookies or authorization header
    const token = req.cookies.token || req.headers['authorization']?.split(' ')[1];

    // Log token for debugging
    console.log('Token:', token); // This line now references the token variable correctly

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Verify token
    jwt.verify(token, 'your_secret_key', (err, user) => {
        if (err) {
            return res.sendStatus(403); // Forbidden
        }
        req.user = user; // Attach user information to the request object
        next(); // Proceed to the next middleware
    });
}

module.exports = authenticateToken;

