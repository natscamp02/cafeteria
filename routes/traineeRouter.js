const express = require('express');
const conn = require('../db');

const router = express.Router();

router.get('/login', (req, res, next) => {
	req.consumeFlash('error').then((msgs) => {
		res.render('trainee-form', { messages: msgs });
	});
});

router.post('/login', (req, res, next) => {
	const data = {
		fname: req.body.fname,
		lname: req.body.lname,
		cohort: Number.parseInt(req.body.cohort),
	};

	// Check if trainee is in the system
	conn.query(
		'SELECT * FROM trainees_table WHERE cohort = ' + data.cohort + ' AND fname = ? AND lname = ?',
		[data.fname, data.lname],
		(err, trainees) => {
			if (err) {
				console.log(err);
				return res.redirect('/');
			}
			if (!trainees.length)
				return req.flash('error', 'No trainee found with those credentials').then(() => res.redirect('/'));

			const trainee = trainees[0];

			// Check if the trainee already made a order that day
			const today = new Date().toISOString().split('T')[0];

			conn.query(
				`SELECT * FROM lunch_table WHERE trainee_id = ` + trainee.id + ` AND date = '` + today + `';`,
				(err, existingTrainees) => {
					try {
						if (err) throw err;
						if (existingTrainees.length) throw new Error('User already made a order');

						res.redirect('/menu/order/' + trainee.id);
					} catch (error) {
						console.log(error.message);

						res.redirect('/');
					}
				}
			);
		}
	);
});

module.exports = router;
