// login.js
const sqlite3 = require('sqlite3').verbose(); // Import sqlite3 for database operations
const crypto = require('crypto'); // Import crypto for password hashing
const db = new sqlite3.Database('./src/db/database.db'); // Connect to the SQLite database

// Utility function to generate a hashed password with a salt
const generateHashedPassword = (password, salt) => {
  return new Promise((resolve, reject) => {
    crypto.scrypt(password, salt, 64, (err, derivedKey) => {
      if (err) {
        reject(err); // Reject the promise if there's an error
      } else {
        resolve(derivedKey.toString('hex')); // Convert the derived key to a hex string
      }
    });
  });
};

const loginController = {
  // Check if a user exists in the database
  checkUserExists: async (username) => {
    try {
      const query = 'SELECT * FROM users WHERE name = ?'; // SQL query to select a user by their username
      // Execute the query to check if the user exists
      const user = await new Promise((resolve, reject) => {
        db.get(query, [username], (err, row) => {
          if (err) {
            reject(err); // Reject the promise if there's an error
          } else {
            resolve(row); // Resolve the promise with the user data if found
          }
        });
      });
      return user; // Return the user data if found
    } catch (error) {
      console.error('Database error:', error.message); // Log the database error to the console
      throw new Error('Database error: ' + error.message); // Throw an error to be handled by the calling function
    }
  },

  // Create a new user in the database
  createUser: async (username, password) => {
    try {
      const salt = crypto.randomBytes(16).toString('hex'); // Generate a unique salt for the user
      const hashedPassword = await generateHashedPassword(password, salt); // Hash the user's password with the generated salt
      const query = 'INSERT INTO users (name, password, salt) VALUES (?, ?, ?)';
      // Insert the new user into the database with the hashed password and salt
      await new Promise((resolve, reject) => {
        db.run(query, [username, hashedPassword, salt], (err) => {
          if (err) {
            reject(err); // Reject the promise if there's an error
          } else {
            resolve(); // Resolve the promise on successful insertion
          }
        });
      });
    } catch (error) {
      console.error('Database error:', error.message); // Log the database error to the console
      throw new Error('Database error: ' + error.message); // Throw an error to be handled by the calling function
    }
  }
};

module.exports = loginController; // Export the loginController object for use in other parts of the application

/**
 * Comments for Students:
 * 1. We use `checkUserExists` to verify if a user is already in the database before performing actions like logging in. This helps in preventing unauthorized access.
 * 2. The `createUser` function generates a unique salt for each user before hashing their password. This ensures that even if two users have the same password, their hashes will be different, making it harder for attackers to use precomputed tables (rainbow tables) to crack passwords.
 * 3. We use the `scrypt` function from the `crypto` library to hash passwords. Hashing passwords adds security, as attackers cannot easily retrieve the original password even if they gain access to the database.
 * 4. The code uses Promises and `async/await` to handle asynchronous operations, which makes the code easier to read and manage compared to using callbacks alone.
 * 5. Improvements can be made to the current system, such as adding input validation to prevent SQL injection attacks, and implementing proper error handling to give more descriptive error messages to users.
 */
