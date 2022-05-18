const express = require('express');
const conn = require('../db');

const router = express.Router();

router.get('/login', (req, res, next) => {
	res.render('trainee-form');
});

router.post('/login', (req, res, next) => {
	const data = {
		fname: req.body.fname,
		lname: req.body.lname,
		cohort: Number.parseInt(req.body.cohort),
	};

	conn.query(
		'SELECT * FROM trainees_table WHERE cohort = ' + data.cohort + ' AND fname = ? AND lname = ?',
		[data.fname, data.lname],
		(err, trainees) => {
			if (err || !trainees.length) {
				if (err) console.log(err);
				return res.redirect('/trainee/login');
			}

			const trainee = trainees[0];

			res.redirect('/menu/order/' + trainee.id);
		}
	);
});

module.exports = router;
