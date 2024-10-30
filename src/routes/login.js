// login.js
const express = require('express'); // Import express to create a router
const router = express.Router(); // Create a new router instance
const crypto = require('crypto'); // Import crypto for password hashing
const loginController = require('../controllers/login'); // Import the login controller for handling user data

// Handle GET requests to the '/login' route
router.get('/', async (req, res) => {
  try {
    // Render the login page for the user to enter their credentials
    res.render('pages/login');
  } catch (err) {
    // If an error occurs, send a 500 status code and the error message
    res.status(500).send(err.message);
  }
});

// Handle POST requests to the '/login' route for user authentication
router.post('/', async (req, res) => {
  try {
    const { username, password } = req.body; // Extract username and password from the request body
    const user = await loginController.checkUserExists(username); // Check if the user exists in the database

    if (user) {
      // If the user exists, hash the provided password using the user's stored salt
      crypto.scrypt(password, user.salt, 64, (err, derivedKey) => {
        if (err) {
          return res.status(500).send(err.message); // Send an error response if hashing fails
        }
        const hashedPassword = derivedKey.toString('hex'); // Convert the derived key to a hex string
        // Compare the hashed password with the stored hashed password
        if (hashedPassword === user.password) {
          req.session.isAuthenticated = true; // Set the session as authenticated
          res.redirect('/forbidden'); // Redirect to the '/forbidden' page after successful login
        } else {
          res.redirect('/'); // Redirect to the home page if the password is incorrect
        }
      });
    } else {
      res.redirect('/'); // Redirect to the home page if the user does not exist
    }
  } catch (err) {
    res.status(500).send(err.message); // Send an error response if something goes wrong
  }
});

module.exports = router; // Export the router for use in other parts of the application

/**
 * Comments for Students:
 * 1. This route handles both GET and POST requests for the '/login' path, providing a way for users to log in to the application.
 * 2. The GET request renders the login page, allowing users to input their credentials.
 * 3. The POST request processes the login information: it first checks if the user exists and then verifies the password.
 * 4. We hash the provided password using the stored salt and compare it with the hashed password in the database. This ensures that passwords are never stored in plain text, adding a layer of security.
 * 5. If the user successfully logs in, we set `req.session.isAuthenticated` to `true`. This allows us to track if a user is logged in and control access to restricted routes.
 * 6. If the user fails authentication, they are redirected to the home page, preventing unauthorized access.
 * 7. Using `async/await` ensures that the code is readable and that asynchronous operations are handled in a consistent manner.
 */
