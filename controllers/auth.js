const User = require('../models/user');

// Переконайся, що тут написано саме exports.getLogin
exports.getLogin = (req, res) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Авторизація'
    });
};

exports.postLogin = (req, res) => {
    User.findOne()
        .then(user => {
            req.session.isLoggedIn = true;
            // Зберігаємо тільки рядок ID користувача, щоб не було конфлікту BSON
            req.session.user = { _id: user._id.toString() };
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