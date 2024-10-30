// users.js
const crypto = require('crypto'); // Import the crypto library for password hashing
const sqlite3 = require('sqlite3').verbose(); // Import sqlite3 for database operations
const db = new sqlite3.Database('./src/db/database.db'); // Connect to the SQLite database

// Utility function to generate a hashed password with a salt
const generateHashedPassword = (password, salt) => {
  return new Promise((resolve, reject) => {
    // Use scrypt to hash the password with the provided salt
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        reject(err); // If there's an error, reject the promise
      } else {
        resolve(derivedKey.toString('hex')); // Convert the derived key to a hex string
      }
    });
  });
};

const usersController = {
  // Create a new user
  createUser: async (req, res) => {
    try {
      const { name, email, password } = req.body; // Get user details from the request body
      // Generate a unique salt for each user to make their password hashes unique
      const salt = crypto.randomBytes(16).toString('hex');
      // Hash the user's password with the generated salt
      const hashedPassword = await generateHashedPassword(password, salt);
      const query = 'INSERT INTO users (name, email, password, salt) VALUES (?, ?, ?, ?)';
      // Insert the new user into the database
      db.run(query, [name, email, hashedPassword, salt], function (err) {
        if (err) {
          return res.status(500).send(err.message); // Send an error response if the database operation fails
        }
        res.redirect(`/users`); // Redirect to the users list page on success
      });
    } catch (err) {
      res.status(500).send(err.message); // Send an error response if something goes wrong
    }
  },

  // Get a user by their ID
  getUser: async (req, res) => {
    try {
      const { id } = req.params; // Get the user ID from the request parameters
      const query = 'SELECT * FROM users WHERE id = ?';
      // Query the database to get the user by ID
      const user = await new Promise((resolve, reject) => {
        db.get(query, [id], (err, row) => {
          if (err) {
            reject(err); // Reject the promise if there's an error
          } else {
            resolve(row); // Resolve the promise with the user data
          }
        });
      });
      if (!user) {
        return res.status(404).send('User not found'); // Send a 404 response if the user doesn't exist
      }
      res.render('pages/user', { user }); // Render the user details page
    } catch (err) {
      res.status(500).send(err.message); // Send an error response if something goes wrong
    }
  },

  // Update a user's details by their ID
  updateUser: async (req, res) => {
    try {
      const { id } = req.params; // Get the user ID from the request parameters
      const { name, email, password } = req.body; // Get the updated user details from the request body
      // Generate a new salt and hash the password if it is provided
      const salt = crypto.randomBytes(16).toString('hex');
      const hashedPassword = await generateHashedPassword(password, salt);
      const query = 'UPDATE users SET name = ?, email = ?, password = ?, salt = ? WHERE id = ?';
      // Update the user in the database
      db.run(query, [name, email, hashedPassword, salt, id], function (err) {
        if (err) {
          return res.status(500).send(err.message); // Send an error response if the database operation fails
        }
        if (this.changes === 0) {
          return res.status(404).send('User not found'); // Send a 404 response if no user was updated
        }
        res.json({ id, name, email }); // Send the updated user details as a JSON response
      });
    } catch (err) {
      res.status(500).send(err.message); // Send an error response if something goes wrong
    }
  },

  // Delete a user by their ID
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params; // Get the user ID from the request parameters
      const query = 'DELETE FROM users WHERE id = ?';
      // Delete the user from the database
      db.run(query, [id], function (err) {
        if (err) {
          return res.status(500).send(err.message); // Send an error response if the database operation fails
        }
        if (this.changes === 0) {
          return res.status(404).send('User not found'); // Send a 404 response if no user was deleted
        }
        res.status(204).send(); // Send a 204 No Content response on successful deletion
      });
    } catch (err) {
      res.status(500).send(err.message); // Send an error response if something goes wrong
    }
  },

  // Get a list of all users
  getAllUsers: async (req, res) => {
    try {
      const query = 'SELECT * FROM users';
      // Query the database to get all users
      const users = await new Promise((resolve, reject) => {
        db.all(query, [], (err, rows) => {
          if (err) {
            reject(err); // Reject the promise if there's an error
          } else {
            resolve(rows); // Resolve the promise with the list of users
          }
        });
      });
      res.render('pages/users', { users }); // Render the users list page
    } catch (err) {
      res.status(500).send(err.message); // Send an error response if something goes wrong
    }
  }
};

module.exports = usersController; // Export the usersController object for use in other parts of the application

/**
 * Comments for Students:
 * 1. We generate a unique salt for each user before hashing their password. This ensures that even if two users have the same password, their hashes will be different, making it harder for attackers to use precomputed tables (rainbow tables) to crack passwords.
 * 2. Passwords are hashed using a strong cryptographic function (scrypt). Hashing passwords makes it more secure to store them in the database, as attackers cannot easily retrieve the original password even if they gain access to the database.
 * 3. We use `req.session.isAuthenticated` to keep track of whether a user is logged in. This helps us control access to certain routes, such as the `/forbidden` route, and ensures that only authenticated users can access protected areas of the application.
 * 4. The `createUser`, `getUser`, `updateUser`, and `deleteUser` functions are RESTful API endpoints for managing user data. The users can be created, read, updated, and deleted.
 * 5. The code uses async/await to handle asynchronous operations, which makes it easier to read and understand compared to using callbacks.
 * 6. The current system can manage users and provide basic authentication. However, improvements can be made, such as adding input validation to prevent malicious inputs (e.g., SQL injection attacks), adding rate limiting to prevent brute-force attacks, and using HTTPS for secure data transmission.
 */
