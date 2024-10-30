// index.js
const express = require('express'); // Import express to create a router
const router = express.Router(); // Create a new router instance

// Handle GET requests to the root ('/') route
router.get('/', async (req, res) => {
  try {
    const title = 'Home page'; // Set the title for the index page
    // Render the 'index' page and pass the title to the template
    res.render('pages/index', { title });
  } catch (err) {
    // If an error occurs, send a 500 status code and the error message
    res.status(500).send(err.message);
  }
});

module.exports = router; // Export the router for use in other parts of the application

/**
 * Comments for Students:
 * 1. This route is used to handle requests to the root URL ('/'). It serves as the main entry point of the application.
 * 2. The `title` variable is defined to provide a title for the home page. This is then passed to the EJS template to display dynamic content.
 * 3. The 'async' keyword is used here for consistency and future-proofing, as you might add asynchronous logic later.
 * 4. The `res.render('pages/index', { title })` function renders the 'index' page and injects the `title` variable into the template, allowing for dynamic page content.
 * 5. If an error occurs while rendering the page, we catch it and send an appropriate error message with a 500 status code.
 */
