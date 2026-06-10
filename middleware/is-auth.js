module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        // Якщо це AJAX/REST запит, повертаємо JSON, інакше редиректимо
        if (req.xhr || req.headers.accept.indexOf('json') > -1) {
            return res.status(401).json({ message: 'Немає доступу. Будь ласка, увійдіть в систему.' });
        }
        return res.redirect('/login');
    }
    next();
};