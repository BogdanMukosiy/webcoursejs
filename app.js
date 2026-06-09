const express = require('express');

const app = express();

// ПУНКТ 2: Перший мідлвар (логування та виклик next)
app.use((req, res, next) => {
    console.log('--- Перший мідлвар пройшов ---');
    next(); // Обов'язково викликаємо next(), щоб запит пішов далі
});

// ПУНКТ 2: Другий мідлвар (логування та виклик next)
app.use((req, res, next) => {
    console.log('--- Другий мідлвар пройшов ---');
    next(); // Передає керування до конкретних маршрутів нижче
});

// ПУНКТ 3: Маршрут для "/users"
// ВАЖЛИВО: Цей маршрут має стояти ВИЩЕ за корінь "/",
// інакше Express збіжиться на "/" і не дійде сюди.
app.use('/users', (req, res, next) => {
    console.log('Обробка маршруту /users');
    res.send('<h1>Spisok koristuvachiv:</h1><ul><li>User Bohdan</li><li>User Polina</li></ul>');
});

// ПУНКТ 3: Маршрут для головної сторінки "/"
app.use('/', (req, res, next) => {
    console.log('Обробка маршруту /');
    res.send('<h1>Vitaiemo na holovnii storintsi Express.js!</h1>');
});

// Запуск сервера на порту 3000
app.listen(3000, () => {
    console.log('Express server is running on port 3000');
});