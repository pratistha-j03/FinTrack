const express = require('express');
const router = express.Router();
const { register, login, getProfile, updateProfile, deleteAccount } = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.delete('/delete', protect, deleteAccount);

module.exports = router;