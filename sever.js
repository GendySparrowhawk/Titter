const express = require('express');
const session = require('express-session');

const app = express();

const api_routes = require('./controllers');

const PORT = process.env.PORT || 3333;

require('dotenv').config();

const db = require('./config/connection');

app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        maxAge: 60 * 60 * 1000,
        httpOnly: true
    }
}));

app.use('/', api_routes);

app.get('*', (req, res) => {
    res.status(404).send({
        message: 'That route is incorrect',
        error: 404
    })
});

db.on('open', () => {
    console.log('db connected');
    app.listen(PORT, () => console.log(`Happy surffing on port: ${PORT}`));
});