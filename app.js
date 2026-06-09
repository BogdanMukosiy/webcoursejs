const express = require('express');
const app = express();

const users = [];

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/users', (req, res) => {
    res.render('users', { users: users });
});

app.post('/add-user', (req, res) => {
    users.push(req.body.username);
    res.redirect('/users');
});

app.listen(3000);