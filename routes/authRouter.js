const express = require('express');
const bcrypt = require('bcrypt');
const conn = require('../db');

const router = express.Router();

router.get('/login', (req, res) => {
	res.render('login');
});
router.post('/login', (req, res) => {
	const hashedPassword = bcrypt.hashSync(req.body.password, 12);

	conn.query(
		'SELECT * FROM users WHERE email = ? and BINARY password = ?',
		[req.body.email, hashedPassword],
		(err, users) => {
			if (err) return res.redirect('/auth/login');

			req.session.isLoggedIn = true;
			res.redirect('/trainee/lunch-table');
		}
	);
});

module.exports = router;
