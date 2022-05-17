const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const traineeRouter = require('./routes/traineeRouter');
const menuRouter = require('./routes/menuRouter');
const authRouter = require('./routes/authRouter');

const app = express();

// Setup template engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Body and cookie parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Creating a session
app.use(
	session({
		secret: process.env.SESSION_SECRET,
		resave: true,
		saveUninitialized: false,
		cookie: {
			maxAge: 1000 * 60 * 10,
		},
	})
);

// Routes
app.use('/trainee', traineeRouter);
app.use('/menu', menuRouter);
app.use('/auth', authRouter);

app.get('/', (req, res) => {
	res.redirect('/menu');
});

// Catch all route
app.all('*', (req, res, next) => {
	next(new Error(req.originalUrl + ' was not found'));
});

// Global error handler
app.use((err, req, res, next) => {
	console.log(err.message);

	res.redirect('/');
});

module.exports = app;
