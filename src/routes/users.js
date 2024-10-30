// users.js
const express = require('express'); // Import express to create a router
const router = express.Router(); // Create a new router instance
const usersController = require('../controllers/users'); // Import the users controller for handling user-related operations

// Handle POST requests to create a new user
router.post('/', usersController.createUser); // Route to create a new user

// Handle GET requests to retrieve a user by their ID
router.get('/:id', usersController.getUser); // Route to get a specific user by ID

// Handle PUT requests to update a user's information by their ID
router.put('/:id', usersController.updateUser); // Route to update user details by ID

// Handle DELETE requests to remove a user by their ID
router.delete('/:id', usersController.deleteUser); // Route to delete a user by ID

// Handle GET requests to retrieve a list of all users
router.get('/', usersController.getAllUsers); // Route to get all users

module.exports = router; // Export the router for use in other parts of the application

/**
 * Comments for Students:
 * 1. This file defines the routes for handling user-related operations such as creating, reading, updating, and deleting users.
 * 2. The `router.post('/')` route is used to create a new user. It uses the `createUser` function from the `usersController`.
 * 3. The `router.get('/:id')` route is used to retrieve a specific user by their ID. It calls the `getUser` function from the `usersController`.
 * 4. The `router.put('/:id')` route is used to update a user's information by their ID. The `updateUser` function is responsible for this.
 * 5. The `router.delete('/:id')` route is used to delete a user by their ID. It calls the `deleteUser` function from the `usersController`.
 * 6. The `router.get('/')` route is used to retrieve a list of all users. It uses the `getAllUsers` function from the `usersController`.
 * 7. These routes follow RESTful conventions, which help in organizing the endpoints based on the type of action being performed (e.g., create, read, update, delete).
 * 8. Using controllers helps keep the routing logic clean and allows for easier maintenance and separation of concerns.
 */
