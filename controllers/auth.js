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

exports.postLogin = (req, res, next) => {
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

    User.findOne({ email: email })
        .then(user => {
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
        })
        .catch(err => console.log(err));
};

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        errorMessage: null,
        oldInput: { email: '', password: '', confirmPassword: '' }
    });
};

exports.postSignup = (req, res, next) => {
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

    // Перевірка чи пошта вже зайнята в базі
    User.findOne({ email: email })
        .then(userDoc => {
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
            return user.save().then(result => {
                res.redirect('/login');
            });
        })
        .catch(err => console.log(err));
};

exports.getReset = (req, res, next) => {
    res.render('auth/reset', {
        path: '/reset',
        pageTitle: 'Reset Password'
    });
};
exports.postReset = (req, res, next) => {
    const email = req.body.email;
    console.log('Запит на скидання пароля для:', email);

    res.redirect('/login');
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(err => {
        if (err) console.log(err);
        res.redirect('/');
    });
};