const router = require('express').Router();
const knex = require('knex');

const knexConfig = {
	client           : 'sqlite3',
	connection       : {
		filename : './data/lambda.db3'
	},
	useNullAsDefault : true
};

const db = knex(knexConfig);

router.get('/', (req, res) => {
	db('cohorts')
		.then((cohorts) => {
			res.status(200).json(cohorts);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.get('/:id', (req, res) => {
	db('cohorts')
		.where({ id: req.params.id })
		.first()
		.then((cohorts) => {
			if (cohorts) {
				res.status(200).json(cohorts);
			} else {
				res.status(404).json({ message: 'No cohorts found with that id' });
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.get('/:id/students', (req, res) => {
	db('cohorts')
		.innerJoin('students', 'cohorts.id', 'students.cohorts_id')
		.where({ cohorts_id: req.params.id })
		// .first()
		.then((students) => {
			if (students) {
				res.status(200).json(students);
			} else {
				res.status(404).json({ message: 'No cohorts found with that id' });
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.post('/', (req, res) => {
	if (!req.body.name) {
		res.status(400).json({ message: 'Please give the cohort a name.' });
	} else {
		db('cohorts')
			.insert(req.body, 'id')
			.then((ids) => {
				db('cohorts').where({ id: ids[0] }).first().then((cohorts) => {
					res.status(200).json(cohorts);
				});
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	}
});

router.delete('/:id', (req, res) => {
	db('cohorts')
		.where({ id: req.params.id })
		.del()
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message : `${count} ${count > 1 ? 'records' : 'record'} deleted.`
				});
			} else {
				res.status(404).json({ message: 'No cohorts found with that id.' });
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.put('/:id', (req, res) => {
	if (!req.body.name) {
		res.status(400).json({ message: 'Please name the cohort' });
	} else {
		db('cohorts')
			.where({ id: req.params.id })
			.update(req.body)
			.then((count) => {
				if (count > 0) {
					res.status(200).json({
						message : `${count} ${count > 1 ? 'records' : 'record'} updated`
					});
				} else {
					res.status(404).json({ message: 'No cohorts found with that id.' });
				}
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	}
});

module.exports = router;
