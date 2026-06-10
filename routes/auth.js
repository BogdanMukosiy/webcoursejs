const express = require('express');
const { check, body } = require('express-validator');

const authController = require('../controllers/auth');
const router = express.Router();

router.get('/login', authController.getLogin);

// Валідація для форми Входу (Login)
router.post(
    '/login',
    [
        body('email')
            .isEmail()
            .withMessage('Будь ласка, введіть коректний E-Mail.')
            .normalizeEmail(),
        body('password', 'Пароль має складатися мінімум з 5 символів і містити лише латинські літери або цифри.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim()
    ],
    authController.postLogin
);

router.get('/signup', authController.getSignup);

// Валідація для форми Реєстрації (Signup)
router.post(
    '/signup',
    [
        check('email')
            .isEmail()
            .withMessage('Будь ласка, введіть коректний E-Mail.')
            .normalizeEmail(),

        body('password', 'Будь ласка, введіть пароль довжиною від 5 символів, що містить лише цифри та латинські літери.')
            .isLength({ min: 5 })
            .isAlphanumeric()
            .trim(),

        body('confirmPassword')
            .trim()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Паролі повинні збігатися!');
                }
                return true;
            })
    ],
    authController.postSignup
);

router.post('/logout', authController.postLogout);


router.get('/reset', authController.getReset);
router.post('/reset', authController.postReset);

module.exports = router;

module.exports = router;