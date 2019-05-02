exports.seed = function(knex, Promise) {
	// Deletes ALL existing entries
	return knex('students').truncate().then(function() {
		// Inserts seed entries
		return knex('students').insert([
			{ name: 'Lidiia', cohorts_id: 1 },
			{ name: 'Ellen', cohorts_id: 4 },
			{ name: 'Anuhbav', cohorts_id: 4 },
			{ name: 'Mary', cohorts_id: 4 },
			{ name: 'Ben', cohorts_id: 4 },
			{ name: 'Will', cohorts_id: 4 },
			{ name: 'Josh', cohorts_id: 4 },
			{ name: 'Steve', cohorts_id: 4 },
			{ name: 'Sharan', cohorts_id: 4 }
		]);
	});
};
