const express = require('express');
const protect = require('../utils/protect');
const conn = require('../db');

const router = express.Router();

router.post('/order', (req, res, next) => {
	res.render('trainee-form', {
		// meal_options: req.body.meal_options,
	});
});

router.post('/confirm-selection', (req, res, next) => {
	const data = {
		cohort: req.body.cohort,
		fname: req.body.fname,
		lname: req.body.lname,
		meal_options: req.body.meal_options,
	};

	conn.query(
		'SELECT * FROM trainees_table WHERE cohort = ? AND fname = ? AND lname = ?',
		Object.values(data),
		(err, trainees) => {
			if (err || !trainees.length) return res.redirect('/order');

			const trainee = trainees[0];
			const date = new Date().toISOString().slice(0, 19).replace('T', ' ');

			conn.query(
				'INSERT INTO lunch_table(trainee_id, meal_option_id, date) VALUES (?, ?, ?)',
				[trainee.id, 1, date],
				(err, result) => {
					if (err) {
						console.log(err);
						return res.redirect('/order');
					}

					res.render('order-created');
				}
			);
		}
	);
});

// ADMIN ONLY
router.get('/lunch-table', protect, (req, res, next) => {
	conn.query(
		`SELECT tt.cohort, tt.fname, tt.lname, mot.option_name, lt.date  
        FROM lunch_table lt, trainees_table tt, meal_options_table mot, meal_category mc 
        WHERE lt.meal_option_id = mot.id AND lt.trainee_id = tt.id AND mot.meal_category = mc.id`,
		(err, data) => {
			if (err) return res.redirect('/');

			res.render('lunch-table', {
				records: data,
			});
		}
	);
});

module.exports = router;
