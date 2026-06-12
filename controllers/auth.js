const { validationResult } = require('express-validator');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login',
        errorMessage: null,
        oldInput: { email: '', password: '' }
    });
};

exports.postLogin = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errors.array()[0].msg,
            oldInput: { email: email, password: password }
        });
    }

    try {
        const user = await User.findOne({ email: email });
        if (!user) {
            return res.status(422).render('auth/login', {
                path: '/login',
                pageTitle: 'Login',
                errorMessage: 'Користувача з таким E-Mail не знайдено.',
                oldInput: { email: email, password: password }
            });
        }

        req.session.isLoggedIn = true;
        req.session.user = { _id: user._id.toString() };

        req.session.save(err => {
            if (err) console.log(err);
            res.redirect('/');
        });
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: null,
        oldInput: { email: '', password: '', confirmPassword: '' }
    });
};

exports.postSignup = async (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('auth/signup', {
            path: '/signup',
            pageTitle: 'Signup',
            errorMessage: errors.array()[0].msg,
            oldInput: { email: email, password: password, confirmPassword: confirmPassword }
        });
    }

    try {
        const userDoc = await User.findOne({ email: email });
        if (userDoc) {
            return res.status(422).render('auth/signup', {
                path: '/signup',
                pageTitle: 'Signup',
                errorMessage: 'Цей E-Mail вже зареєстрований у системі.',
                oldInput: { email: email, password: password, confirmPassword: confirmPassword }
            });
        }

        const user = new User({
            name: email.split('@')[0],
            email: email,
            cart: { items: [] }
        });

        await user.save();
        res.redirect('/login');
    } catch (err) {
        const error = new Error(err);
        error.statusCode = 500;
        return next(error);
    }
};

exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password'
    });
};

exports.postReset = (req, res, next) => {
    console.log('Запит на скидання пароля для:', req.body.email);
    res.redirect('/login');
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) console.log(err);
        res.redirect('/');
    });
};