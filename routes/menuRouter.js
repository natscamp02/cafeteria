const express = require('express');
const conn = require('../db');
const protect = require('../utils/protect');

const router = express.Router();

router.get('/order/:trainee_id', (req, res, next) => {
	conn.query(
		`SELECT mot.id, mot.option_name, mot.image, mc.category_name 
        FROM meal_options_table mot, meal_category mc 
        WHERE mot.meal_category = mc.id`,
		(err, data) => {
			if (err) {
				console.log(err);
				return res.redirect('/');
			}

			const categories = new Set(data.map((d) => d.category_name));
			const optsByCategory = [...categories].map((c) => ({
				name: c,
				options: data.filter((d) => d.category_name === c),
			}));

			res.render('menu', { optsByCategory, trainee_id: req.params.trainee_id });
		}
	);
});

router.post('/order', (req, res, next) => {
	const data = {
		trainee_id: req.body.trainee_id,
		options: req.body.options,
	};

	const today = new Date().toISOString().slice(0, 19).replace('T', ' ');

	conn.query(
		'INSERT INTO lunch_table(trainee_id, meal_option_ids, date) VALUES (?, ?, ?)',
		[data.trainee_id, data.options, today],
		(err, result) => {
			if (err) {
				console.log(err);
				return res.redirect('/');
			}

			res.render('order-created');
		}
	);
});

// ADMIN ONLY
router.get('/lunch-table', protect, (req, res, next) => {
	try {
		const today = new Date().toISOString().split('T')[0];

		conn.query(
			`SELECT tt.cohort, tt.fname, tt.lname, lt.meal_option_ids, lt.date  
            FROM lunch_table lt, trainees_table tt 
            WHERE lt.trainee_id = tt.id AND lt.date = ?`,
			[today],
			(err, rows) => {
				if (err) throw err;

				const lunchData = [...rows];

				conn.query('SELECT * FROM meal_options_table', (err, meal_options) => {
					if (err) throw err;

					lunchData.forEach((data) => {
						const options = data.meal_option_ids.split(',');

						data.options = meal_options
							.filter((opt) => options.includes(`${opt.id}`))
							.map((opt) => opt.option_name)
							.join(', ');
					});

					res.render('lunch-table', {
						records: lunchData,
					});
				});
			}
		);
	} catch (error) {
		console.log(error);

		res.redirect('/');
	}
});

module.exports = router;
