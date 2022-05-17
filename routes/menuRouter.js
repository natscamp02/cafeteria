const express = require('express');
const conn = require('../db');

const router = express.Router();

router.get('/', (req, res, next) => {
	conn.query(
		`SELECT mot.id, mot.option_name, mc.category_name 
        FROM meal_options_table mot, meal_category mc 
        WHERE mot.meal_category = mc.id`,
		(err, data) => {
			res.render('index', { options: data });
		}
	);
});

module.exports = router;
