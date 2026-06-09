const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');

// Твій індивідуальний рядок підключення до MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://bogdan:YAECHNIK123321@coursejs.noaxprk.mongodb.net/shop?retryWrites=true&w=majority&appName=coursejs';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

// 1. НАЛАШТУВАННЯ ШАБЛОНІЗАТОРА EJS
app.set('view engine', 'ejs');
app.set('views', 'views');

// 2. РОЗДАЧА СТАТИКИ (Обов'язково на самому початку, щоб працював CSS!)
app.use(express.static(path.join(__dirname, 'public')));

// 3. ПАРСИНГ ДАНИХ ФОРМ
app.use(express.urlencoded({ extended: false }));

// 4. НАЛАШТУВАННЯ СЕСІЙНОГО МІДЛВАРУ
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store: store
    })
);

// 5. МІДЛВАР ДЛЯ РЕЄСТРАЦІЇ ПОВНОЦІННОЇ МОДЕЛІ КОРИСТУВАЧА MONGOOSE
app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user; // Тепер у req.user є всі методи Mongoose
            next();
        })
        .catch(err => console.log(err));
});

// 6. МІДЛВАР ГЛОБАЛЬНИХ ЗМІННИХ ДЛЯ ШАБЛОНІВ EJS
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

// 7. ІМПОРТ ТА РЕЄСТРАЦІЯ МАРШРУТІВ MVC
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');

app.use(authRoutes);
app.use(shopRoutes);
app.use('/admin', adminRoutes); // Адмін-панель з префіксом

// 8. ПІДКЛЮЧЕННЯ ДО БАЗИ ДАНИХ ТА ЗАПУСК СЕРВЕРА
mongoose
    .connect(MONGODB_URI)
    .then(result => {
        // Автоматично створюємо тестового користувача, якщо база даних порожня
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
        app.listen(3000, () => {
            console.log('===============================================');
            console.log('Сервер успішно запущено на порту 3000!');
            console.log('База даних MongoDB Atlas підключена.');
            console.log('Перейдіть за адресою: http://localhost:3000');
            console.log('===============================================');
        });
    })
    .catch(err => console.log(err));