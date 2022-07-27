const express = require('express');
const router = express.Router();

// @route   GET api/auth
// @desc    Test route
// @access  Public (no token required)
router.get('/', (req, res) => res.send('Auth route'));

module.exports = router;