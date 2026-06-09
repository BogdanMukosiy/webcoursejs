const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');
const authRoutes = require('./routes/auth');

// !!! ВСТАВ СВІЙ РЯДОК ПІДКЛЮЧЕННЯ (локальний або хмарний Atlas)
const MONGODB_URI = 'mongodb://127.0.0.1:27017/shop';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

// ВИКОНАННЯ ЗАВДАННЯ 5: Перевіряємо сесію та ініціалізуємо повноцінну модель користувача
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

// Передаємо глобальну змінну авторизації для всіх шаблонів EJS
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

// Підключаємо маршрути
app.use(authRoutes);

// Головна сторінка-заглушка для перевірки стану сесії
app.get('/', (req, res) => {
    res.send(`
    <h1>Головна сторінка</h1>
    <p>Статус авторизації: ${req.session.isLoggedIn ? 'Залогінений як ' + req.user.name : 'Гість'}</p>
    ${req.session.isLoggedIn
        ? '<form action="/logout" method="POST"><button>Вийти</button></form>'
        : '<a href="/login">Увійти</a>'}
  `);
});

mongoose
    .connect(MONGODB_URI)
    .then(result => {
        // Створюємо тестового користувача, якщо в базі нікого немає
        return User.findOne();
    })
    .then(user => {
        if (!user) {
            const newUser = new User({
                name: 'Богдан',
                email: 'bogdan@test.com',
                cart: { items: [] }
            });
            return newUser.save();
        }
        return user;
    })
    .then(() => {
        app.listen(3000, () => console.log('Сервер запущено на порту 3000'));
    })
    .catch(err => console.log(err));