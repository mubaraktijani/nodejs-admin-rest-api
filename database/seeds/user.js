global.Bookshelf = require('./../../app/utils/model');
const User = require('./../../app/models/User');

const data = {
	name: 'Administrator',
	username: 'admin',
	email: 'admin@admin.com',
	password: '123456',
};

user_id = 0;

exports.seed = (knex, Promise) => {
	console.log();
	console.log('Seeding User');

	// Empty Role Permissions table to insert new record
	return knex('user_roles').del()
		
		.then(() => log('User Role Table TRUNCATE'))
		
		// Empty Permissions table to insert new record
		.then(() => knex('users').del())
		
		.then(() => log('Users Table TRUNCATE'))

		// insert roles
		.then(() => User.create(data))

		.then(user => User.where('id', user.id).fetch())

		.then(user => user.set('isVerified', true).save())

		.then(user => {
			user_id = user.id;
			log('User Account is created and Verified');
		})

		.then(() => knex('roles').where('code', 'admin').first())

		.then(role => knex('user_roles').insert({ user_id: user_id, role_id: role.id }))
		
		.then(() => log('User Account is Assigned the role of Admin'))

		.catch(err => console.error(err));
};

const log = (msg) => console.log('  - ' + msg);

const ucwords = (word) => {
	return word.split('_')
		.join(' ')
		.toLowerCase()
		.replace(/\b[a-z]/g, letter => letter.toUpperCase());
};

const removeDups = (names) => {
	let unique = {};
	names.forEach(i => {
		if (!unique[i]) unique[i] = true;
	});
	return Object.keys(unique);
};

exports.log = log;

exports.ucwords = ucwords;

exports.removeDups = removeDups;