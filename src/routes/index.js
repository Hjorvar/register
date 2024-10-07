const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const title = 'Home page';
    res.render('pages/index', { title });
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;
