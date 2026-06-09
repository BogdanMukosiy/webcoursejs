const User = require('../models/user');

exports.getLogin = (req, res) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Авторизація',
        isAuthenticated: false
    });
};

exports.postLogin = (req, res) => {
    User.findById('60c72b2f9b1d8b2bad123456') // Захардкоджений ID користувача для тесту сесії
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
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