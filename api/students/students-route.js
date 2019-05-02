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
	db('students')
		.then((students) => {
			res.status(200).json(students);
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.get('/:id', (req, res) => {
	db('students')
		.innerJoin('cohorts', 'cohorts.id', 'students.cohorts_id')
		.select('students.id', 'students.name', 'cohorts.name as cohort')
		.where({ 'students.id': req.params.id })
		.first()
		.then((student) => {
			if (student) {
				res.status(200).json(student);
			} else {
				res.status(404).json({ message: 'No students found with that id' });
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.post('/', (req, res) => {
	if (!req.body.name) {
		res.status(400).json({ message: "Please provide the student's a name." });
	} else {
		db('students')
			.insert(req.body, 'id')
			.then((ids) => {
				db('students').where({ id: ids[0] }).first().then((students) => {
					res.status(200).json(students);
				});
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	}
});

router.delete('/:id', (req, res) => {
	db('students')
		.where({ id: req.params.id })
		.del()
		.then((count) => {
			if (count > 0) {
				res.status(200).json({
					message : `${count} ${count > 1 ? 'records' : 'record'} deleted.`
				});
			} else {
				res.status(404).json({ message: 'No students found with that id.' });
			}
		})
		.catch((err) => {
			res.status(500).json(err);
		});
});

router.put('/:id', (req, res) => {
	if (!req.body.name) {
		res.status(400).json({ message: 'Please provide a name' });
	} else {
		db('students')
			.where({ id: req.params.id })
			.update(req.body)
			.then((count) => {
				if (count > 0) {
					res.status(200).json({
						message : `${count} ${count > 1 ? 'records' : 'record'} updated`
					});
				} else {
					res.status(404).json({ message: 'No students found with that id.' });
				}
			})
			.catch((err) => {
				res.status(500).json(err);
			});
	}
});

module.exports = router;
