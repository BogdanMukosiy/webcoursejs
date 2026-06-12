const { validationResult } = require('express-validator');
const User = require('../models/user');

// GET: Отримання статусу поточного користувача
exports.getUserStatus = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Користувач не авторизований.' });
    }

    res.status(200).json({
        message: 'Статус успішно отримано.',
        status: req.user.status || 'Новий користувач'
    });
};

// POST: Обробник події зміни статусу
exports.updateUserStatus = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({
            message: 'Валідація провалена. Введено некоректні дані.',
            errors: errors.array()
        });
    }

    const newStatus = req.body.status;

    try {
        req.user.status = newStatus;
        await req.user.save();
        console.log(`[Status Event] Статус користувача ${req.user.email} змінено на: ${newStatus}`);
        res.status(200).json({
            message: 'Статус успішно оновлено.',
            status: newStatus
        });
    } catch (err) {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    }
};