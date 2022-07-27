//handle registering/adding post etc

const express = require('express');
const router = express.Router();

// @route   GET api/post
// @desc    Test route
// @access  Public (no token required)
router.get('/', (req, res) => res.send('Post route'));

module.exports = router;