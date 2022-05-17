const express = require('express');
const conn = require('../db');

const router = express.Router();

router.get('/login', (req, res) => {
	res.render('login');
});
router.post('/login', (req, res) => {
	const data = { email: req.body.email, password: req.body.password };

	conn.query('SELECT * FROM users WHERE email = ? and BINARY password = ?', Object.values(data), (err, users) => {
		if (err) return res.redirect('/auth/login');

		req.session.isLoggedIn = true;
		res.redirect('/trainee/lunch-table');
	});
});

module.exports = router;
