const crypto = require('crypto');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./src/db/database.db');

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    crypto.scrypt(password, 'salt', 64, (err, derivedKey) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      const hashedPassword = derivedKey.toString('hex');
      db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], function(err) {
        if (err) {
          return res.status(500).send(err.message);
        }
        res.render('pages/users', { users });
      });
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getUser = async (req, res) => {
  try {
    const { id } = req.params;
    db.get('SELECT * FROM users WHERE id = ?', [id], (err, user) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (!user) {
        return res.status(404).send('User not found');
      }
      res.json(user);
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    crypto.scrypt(password, 'salt', 64, (err, derivedKey) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      const hashedPassword = derivedKey.toString('hex');
      db.run('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [name, email, hashedPassword, id], function(err) {
        if (err) {
          return res.status(500).send(err.message);
        }
        if (this.changes === 0) {
          return res.status(404).send('User not found');
        }
        res.json({ id, name, email });
      });
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    db.run('DELETE FROM users WHERE id = ?', [id], function(err) {
      if (err) {
        return res.status(500).send(err.message);
      }
      if (this.changes === 0) {
        return res.status(404).send('User not found');
      }
      res.status(204).send();
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    db.all('SELECT * FROM users', [], (err, users) => {
      if (err) {
        return res.status(500).send(err.message);
      }
      res.render('pages/users', { users });
    });
  } catch (err) {
    res.status(500).send(err.message);
  }
};
