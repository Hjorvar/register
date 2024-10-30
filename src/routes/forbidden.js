// forbidden.js
const express = require('express'); // Import express to create a router
const router = express.Router(); // Create a new router instance

// Handle GET requests to the '/forbidden' route
router.get('/', async (req, res) => {
  try {
    // Render the 'forbidden' page if the user tries to access a restricted area
    res.render('pages/forbidden');
  } catch (err) {
    // If an error occurs, send a 500 status code and the error message
    res.status(500).send(err.message);
  }
});

module.exports = router; // Export the router for use in other parts of the application

/**
 * Comments for Students:
 * 1. This route is used to handle requests to the '/forbidden' path. It serves as a way to show users that they are not allowed to access certain pages without proper permissions.
 * 2. The 'async' keyword is used here for consistency, as you might need to add asynchronous logic in the future.
 * 3. We use `res.render('pages/forbidden')` to serve the 'forbidden' page to the user, which displays a message indicating that access is restricted.
 * 4. If an error occurs while rendering the page, we catch it and send an appropriate error message with a 500 status code.
 */
