const express = require('express');
const bcrypt = require('bcrypt');
const conn = require('../db');

const router = express.Router();

router.get('/login', (req, res) => {
	res.render('login');
});

router.post('/login', async (req, res) => {
	conn.query('SELECT * FROM users WHERE email = ?', [req.body.email], async (err, users) => {
		if (err) {
			console.log(err);
			return res.redirect(req.originalUrl);
		}

		if (!users.length) {
			console.log('Email not found');
			return res.redirect(req.originalUrl);
		}

		if (!(await bcrypt.compare(req.body.password, users[0].password))) {
			console.log('Password is incorrect');
			return res.redirect(req.originalUrl);
		}

		req.session.isLoggedIn = true;
		res.redirect('/menu/lunch-table');
	});
});

module.exports = router;
