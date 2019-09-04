const mapPermission = {
	c: 'create',
	r: 'read',
	u: 'update',
	d: 'delete'
};


const data = {
	admin: {
		admin: 'c,r,u,d'
	},
	manager: {
		auth_users: 'c,r,u,d',
		auth_roles: 'c,r,u,d',
		auth_permissions: 'c,r,u,d',
		subscriptions: 'c,r,u,d'
	},
	customer: {
		auth_users: 'r',
		subscriptions: 'r'
	},
};

let roles = [];
let permissions = [];
let role_permissions = {};

exports.seed = (knex, Promise) => {
	console.log();
	console.log('Seeding Roles, Permission and Role Permission');
	
	// Empty Role Permissions table to insert new record
	return knex('role_permissions').del()
		
		.then(() => log('Role Permissions TRUNCATE'))
		
		// Empty Permissions table to insert new record
		.then(() => knex('permissions').del())
		
		.then(() => log('Permissions TRUNCATE'))
		
		// Empty Roles table to insert new record
		.then(() => knex('roles').del())
		
		.then(() => log('Roles TRUNCATE'))

		// parse role permission {data}
		.then(() => {
			Object.keys(data).forEach(role => {
				role_permissions[role] = [];
				role = role.toLocaleLowerCase().split(' ').join('_');

				roles.push({
					code: role,
					name: ucwords(role),
					description: ucwords(role)
				});

				Object.keys(data[role]).forEach(perm => {

					data[role][perm].split(',').forEach(permMap => {
						const map = mapPermission[permMap] + '_' + perm;
						permissions.push(map);


						role_permissions[role].push({
							role: role,
							permission: map,
							role_id: 0,
							permission_id: 0
						});
					});

				});
			});
		})

		// insert roles
		.then(() => knex('roles').insert(roles))

		.then(() => log('Roles Inerted'))

		// fetch inserted roles into collection
		.then(() => knex('roles'))

		//parse roles collection and update role_permission role_id
		.then(collection => collection.forEach(role => {
			role_permissions[role.code].forEach(map => {
				map.role_id = role.id;
			});
		}))

		// remove Duplicates from permissions and insert
		.then(() => {
			let perms = [];
			permissions = removeDups(permissions);
			permissions.forEach(permission => {
				perms.push({
					code: permission,
					name: ucwords(permission),
					description: ucwords(permission)
				});
			});
			return knex('permissions').insert(perms);
		})

		.then(() => log('Permissions Inerted'))

		// fetch inserted permission into collection
		.then(() => knex('permissions'))

		//parse permission collection and update role_permission permission_id
		.then(collection => collection.forEach(perms => {
			Object.keys(role_permissions).forEach(map => {
				role_permissions[map].forEach(map => {
					map.permission_id = (map.permission === perms.code) ? perms.id : map.permission_id;
				});
			});
		}))

		// parse role_permission query by getting role_id and 
		// permission_id of each role to form insert query
		.then(() => {
			role_permissions.query = [];
			Object.keys(role_permissions).forEach(map => {
				if (map !== 'query')
					role_permissions[map].forEach(rolePerm => {
						role_permissions.query.push({
							role_id: rolePerm.role_id,
							permission_id: rolePerm.permission_id
						});
					});
			});
		})

		// insert role_permissions
		.then(() => knex('role_permissions').insert(role_permissions.query))
		
		.then(() => log('Role Permissions Inerted'))

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