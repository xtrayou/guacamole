const express = require('express');

const users = require('./users');
const connections = require('./connections');
const mappings = require('./mappings');
const stats = require('./stats');

const router = express.Router();

router.use('/users', users);
router.use('/connections', connections);
router.use('/', mappings); // exposes /mappings and /mappings/:userId
router.use('/', stats);    // exposes /stats

module.exports = router;
