const express = require('express');
const { body } = require('express-validator');

const statusController = require('../controllers/status');
// Мідлвар захисту роутів, який Макс вводить у цих лекціях
const isAuth = require('../middleware/is-auth');

const router = express.Router();

// Отримання статусу поточного користувача
router.get('/status', isAuth, statusController.getUserStatus);

// Оновлення статусу користувача з валідацією
router.post(
    '/status',
    isAuth,
    [
        body('status')
            .trim()
            .notEmpty()
            .withMessage('Статус не може бути порожнім.')
    ],
    statusController.updateUserStatus
);

module.exports = router;