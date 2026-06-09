const User = require('../models/user');

exports.getLogin = (req, res) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Авторизація',
        isAuthenticated: req.session.isLoggedIn
    });
};

exports.postLogin = (req, res) => {
    // Шукаємо тестового користувача (створимо його в app.js)
    User.findOne()
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user; // Зберігаємо у сесію
            req.session.save(err => {
                if (err) console.log(err);
                res.redirect('/');
            });
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res) => {
    req.session.destroy(err => {
        if (err) console.log(err);
        res.redirect('/');
    });
};