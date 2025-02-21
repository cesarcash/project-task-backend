const express = require('express');
const router = express.Router();
const { validateUpdateUser } = require('../middleware/validations');

const { getUser, updateUser } = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', validateUpdateUser, updateUser);

module.exports = router;