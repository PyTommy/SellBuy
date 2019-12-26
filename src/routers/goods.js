const express = require('express');
const router = express.Router();

// @route     GET /api/goods/:id
// @desc      Get goods
// @access    Public
router.get('/', (req, res) => res.send("This is goods router"));

module.exports = router;