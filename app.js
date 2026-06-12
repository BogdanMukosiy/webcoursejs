const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const User = require('./models/user');

// Твій рядок підключення до MongoDB Atlas
const MONGODB_URI = 'mongodb+srv://bogdan:YAECHNIK123321@coursejs.noaxprk.mongodb.net/shop?retryWrites=true&w=majority&appName=coursejs';

const app = express();
const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

// 1. НАЛАШТУВАННЯ ШАБЛОНІЗАТОРА EJS
app.set('view engine', 'ejs');
app.set('views', 'views');

// 2. РОЗДАЧА СТАТИКИ (CSS, картинок тощо)
app.use(express.static(path.join(__dirname, 'public')));

// 3. ПАРСИНГ ВХІДНИХ ДАНИХ (Форми та JSON)
app.use(express.json()); // Підтримка JSON для статусів (Завдання 7)
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
            if (!user) {
                return next();
            }
            req.user = user; // Додаємо методи Mongoose у req.user
            next();
        })
        .catch(err => console.log(err));
});

// 6. МІДЛВАР ГЛОБАЛЬНИХ ЗМІННИХ ДЛЯ ШАБЛОНІВ EJS
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});

// 7. ІМПОРТ МАРШРУТІВ
const authRoutes = require('./routes/auth');
const shopRoutes = require('./routes/shop');
const adminRoutes = require('./routes/admin');
const statusRoutes = require('./routes/status'); // Твої статус-роути

// РЕЄСТРАЦІЯ МАРШРУТІВ
app.use(authRoutes);
app.use(shopRoutes);
app.use(statusRoutes);
app.use('/admin', adminRoutes);

// 8. ЦЕНТРАЛІЗОВАНИЙ ОБРОБНИК ПОМИЛОК (Error Handling Middleware)
app.use((error, req, res, next) => {
    console.log('[Глобальна помилка]:', error.message);
    const status = error.statusCode || 500;
    const message = error.message;

    // Якщо запит чекає на JSON (наприклад, від статусів), повертаємо JSON, інакше сторінку
    if (req.xhr || (req.headers.accept && req.headers.accept.indexOf('json') > -1)) {
        return res.status(status).json({ message: message });
    }
    res.status(status).render('500', {
        pageTitle: 'Помилка сервера',
        path: '/500',
        isAuthenticated: req.session ? req.session.isLoggedIn : false
    });
});

// 9. ПІДКЛЮЧЕННЯ ДО БАЗИ ДАНИХ ТА ЗАПУСК СЕРВЕРА ЧЕРЕЗ ASYNC/AWAIT (Завдання 8)
const startServer = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('База даних MongoDB Atlas підключена успішно.');

        // Автоматично створюємо тестового користувача, якщо база даних порожня
        const user = await User.findOne();
        if (!user) {
            const newUser = new User({
                name: 'Богдан',
                email: 'bogdan@test.com',
                status: 'I am new!',
                cart: { items: [] }
            });
            await newUser.save();
            console.log('Створено початкового тестового користувача.');
        }

        app.listen(3000, () => {
            console.log('===================================================');
            console.log('Сервер успішно запущено на порту 3000 (Async/Await)!');
            console.log('Перейдіть за адресою: http://localhost:3000');
            console.log('===================================================');
        });
    } catch (err) {
        console.log('Помилка критичного запуску сервера або підключення до БД:', err);
    }
};

startServer();