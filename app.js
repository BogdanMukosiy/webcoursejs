const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');

const MONGODB_URI = 'mongodb+srv://bogdan:YAECHNIK123321@coursejs.noaxprk.mongodb.net/shop?retryWrites=true&w=majority&appName=coursejs';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json()); // Додано для підтримки JSON-запитів від статус-роутів
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

// ІМПОРТ МАРШРУТІВ
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const statusRoutes = require('./routes/status'); // Підключаємо статус-роути

// РЕЄСТРАЦІЯ МАРШРУТІВ
app.use(authRoutes);
app.use(shopRoutes);
app.use(statusRoutes); // Реєструємо в загальний пул
app.use('/admin', adminRoutes);

// Централізований обробник помилок (Error Handling Middleware)
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res.status(status).json({ message: message });
});

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        return User.findOne();
    })
    .then(user => {
        if (!user) {
            const newUser = new User({
                name: 'Богдан',
                email: 'bogdan@test.com',
                status: 'I am new!',
                cart: { items: [] }
            });
            return newUser.save();
        }
        return user;
    })
    .then(() => {
        app.listen(3000, () => {
            console.log('Сервер запущено. Готовий до тестування Завдання 7 на порту 3000');
        });
    })
    .catch(err => console.log(err));