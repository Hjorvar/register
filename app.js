// app.js
const express = require('express'); // Import express to create an application
const session = require('express-session'); // Import express-session for managing user sessions
const crypto = require('crypto'); // Import crypto for secure operations (e.g., password hashing)
const app = express(); // Create a new instance of the express application

// Import the routes for different parts of the application
const indexRoutes = require('./src/routes'); // Routes for the home page
const usersRoutes = require('./src/routes/users'); // Routes for user-related operations
const loginRoutes = require('./src/routes/login'); // Routes for login functionality
const forbiddenRoutes = require('./src/routes/forbidden'); // Routes for forbidden pages

// Set up the view engine as EJS for rendering HTML templates
app.set('view engine', 'ejs');
app.set('views', './src/views'); // Set the directory where view templates are located

// Middleware to parse JSON and URL-encoded data from incoming requests
app.use(express.json()); // Parse JSON data
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.static('public')); // Serve static files from the 'public' directory (e.g., CSS, images)

// Session middleware for user authentication
app.use(session({
  secret: 'your_secret_key', // Secret key used to sign the session ID cookie
  resave: false, // Do not save session if it wasn't modified
  saveUninitialized: false, // Do not create a session until something is stored in it
  cookie: { httpOnly: true, sameSite: 'strict' } // Secure cookie settings to prevent XSS attacks
}));

// Middleware to check if user is logged in before accessing certain routes
function isAuthenticated(req, res, next) {
  if (req.session.isAuthenticated) { // Check if the user is authenticated
    return next(); // Proceed if authenticated
  }
  res.redirect('/'); // Redirect to the home page if not authenticated
}

// Set up the routes for different parts of the application
app.use('/', indexRoutes); // Home page routes
app.use('/users', usersRoutes); // User management routes
app.use('/login', loginRoutes); // Login routes
app.use('/forbidden', isAuthenticated, forbiddenRoutes); // Forbidden page routes (protected by authentication middleware)

// Start the server and listen on port 3000
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000'); // Log a message to indicate the server is running
});

/**
 * Comments for Students:
 * 1. This file is the main entry point for the application. It sets up the server, middleware, and routes.
 * 2. The `express-session` middleware is used to manage user sessions, allowing us to keep track of whether a user is logged in.
 * 3. The `isAuthenticated` middleware is used to protect certain routes, ensuring that only authenticated users can access them.
 * 4. We use different routes (`indexRoutes`, `usersRoutes`, `loginRoutes`, `forbiddenRoutes`) to keep the code organized and follow the principle of separation of concerns.
 * 5. The view engine is set to EJS, which allows us to use templates to render dynamic HTML pages.
 * 6. The server listens on port 3000, and a message is logged to indicate that it is running.
 * 7. Improvements can be made by using HTTPS for secure communication, and adding rate limiting to prevent brute-force attacks on login.
 */
