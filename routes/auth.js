const express = require('express');
const authController = require('../controllers/auth');
const router = express.Router();

// 5-й рядок, на який лаявся Node.js:
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.post('/logout', authController.postLogout);

module.exports = router;