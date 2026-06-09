const http = require('http');

const server = http.createServer((req, res) => {
    const url = req.url;
    const method = req.method;

    // Пункт 2: Обробка маршруту "/"
    if (url === '/') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Assignment 1</title></head>');
        res.write('<body>');
        res.write('<h1>Welcome to my Node.js Server!</h1>'); // Greeting text

        // Пункт 3: Додавання форми з <input name="username"> та кнопкою
        res.write('<form action="/create-user" method="POST">');
        res.write('<input type="text" name="username" placeholder="Enter username">');
        res.write('<button type="submit">Send</button>');
        res.write('</form>');

        res.write('</body>');
        res.write('</html>');
        return res.end();
    }

    // Пункт 2: Обробка маршруту "/users" (список dummy users)
    if (url === '/users') {
        res.setHeader('Content-Type', 'text/html');
        res.write('<html>');
        res.write('<head><title>Users List</title></head>');
        res.write('<body>');
        res.write('<ul>');
        res.write('<li>User 1</li>');
        res.write('<li>User 2</li>');
        res.write('<li>User 3</li>');
        res.write('</ul>');
        res.write('</body>');
        res.write('</html>');
        return res.end();
    }

    // Пункт 4: Обробка маршруту "/create-user" та парсинг POST-даних
    if (url === '/create-user' && method === 'POST') {
        const body = [];

        // Збираємо шматочки даних (chunks)
        req.on('data', (chunk) => {
            body.push(chunk);
        });

        // Потік завершився, обробляємо буфер
        return req.on('end', () => {
            const parsedBody = Buffer.concat(body).toString(); // Отримуємо рядок типу "username=Bohdan"
            const username = parsedBody.split('=')[1]; // Витягуємо саме значення після знаку "="

            // Виводимо отримане ім'я користувача в консоль сервера
            console.log(`Received username: ${decodeURIComponent(username)}`);

            // Робимо редірект назад на головну сторінку
            res.statusCode = 302;
            res.setHeader('Location', '/');
            return res.end();
        });
    }

    // Дефолтна відповідь для неіснуючих маршрутів
    res.statusCode = 404;
    res.setHeader('Content-Type', 'text/html');
    res.write('<html><body><h1>Page not found</h1></body></html>');
    res.end();
});

// Пункт 1: Запуск сервера на порту 3000
server.listen(3000, () => {
    console.log('Server is running on port 3000');
});