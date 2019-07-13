const Role = require('../../app/models/role.model');
const Permissions = require('../../app/models/permission.model');

const mapPermission = {
	c : 'create',
	r : 'read',
	u : 'update',
	d : 'delete'
};


const data = {
	admin : {
		admin_panel : 'r',
		api : 'r',
		auth_users : 'c,r,u,d',
		auth_roles : 'c,r,u,d',
		auth_permissions : 'c,r,u,d',
		auth_profile : 'r,u',
		common_companies : 'c,r,u,d',
		common_import : 'c',
		common_items : 'c,r,u,d',
		common_uploads : 'd',
		common_notifications : 'c,r,u,d',
		incomes_invoices : 'c,r,u,d',
		incomes_revenues : 'c,r,u,d',
		incomes_customers : 'c,r,u,d',
		expenses_bills : 'c,r,u,d',
		expenses_payments : 'c,r,u,d',
		expenses_vendors : 'c,r,u,d',
		banking_accounts : 'c,r,u,d',
		banking_transfers : 'c,r,u,d',
		banking_transactions : 'r',
		banking_reconciliations : 'c,r,u,d',
		settings_categories : 'c,r,u,d',
		settings_settings : 'r,u',
		settings_taxes : 'c,r,u,d',
		settings_currencies : 'c,r,u,d',
		settings_modules : 'r,u',
		modules_home : 'r',
		modules_tiles : 'r',
		modules_item : 'c,r,u,d',
		modules_token : 'c,u',
		modules_my : 'r',
		install_updates : 'r,u',
		notifications : 'r,u',
		reports_income_summary : 'r',
		reports_expense_summary : 'r',
		reports_income_expense_summary : 'r',
		reports_profit_loss : 'r',
		reports_tax_summary : 'r',
		wizard_companies : 'c,r,u',
		wizard_currencies : 'c,r,u',
		wizard_taxes : 'c,r,u',
		wizard_finish : 'c,r,u',
    },
	manager : {
		admin_panel : 'r',
		auth_profile : 'r,u',
		common_companies : 'c,r,u,d',
		common_import : 'c',
		common_items : 'c,r,u,d',
		common_notifications : 'c,r,u,d',
		incomes_invoices : 'c,r,u,d',
		incomes_revenues : 'c,r,u,d',
		incomes_customers : 'c,r,u,d',
		expenses_bills : 'c,r,u,d',
		expenses_payments : 'c,r,u,d',
		expenses_vendors : 'c,r,u,d',
		banking_accounts : 'c,r,u,d',
		banking_transfers : 'c,r,u,d',
		banking_transactions : 'r',
		banking_reconciliations : 'c,r,u,d',
		settings_settings : 'r,u',
		settings_categories : 'c,r,u,d',
		settings_taxes : 'c,r,u,d',
		settings_currencies : 'c,r,u,d',
		settings_modules : 'r,u',
		install_updates : 'r,u',
		notifications : 'r,u',
		reports_income_summary : 'r',
		reports_expense_summary : 'r',
		reports_income_expense_summary : 'r',
		reports_profit_loss : 'r',
		reports_tax_summary : 'r',
    },
	customer : {
		customer_panel : 'r',
		customers_invoices : 'r,u',
		customers_payments : 'r,u',
		customers_transactions : 'r',
		customers_profile : 'r,u',
    },
};

let roles = [];
let permissions = [];
let role_permissions = [];

exports.seed = (knex, Promise) => {
	return knex('role_permissions').del()
	.then(() => knex('permissions').del())
	.then(() => knex('roles').del())
	.then(() => {
		for(let role in  data) {
			roles.push({
				code			: role,
				name			: ucwords(role),
				description		: ucwords(role)
			});
		}
	})
	.then(() => {
		knex('roles').insert(roles).then(() => {
			knex('roles').then(r => {
				role_permissions['id'] = [];
				r.forEach(role => {
					role_permissions['id'][role.code] = role.id;
				});
			});
		});
	})
	.then(() => {
		roles.forEach((role, k) => {
			const _modules = data[role.code];
			role_permissions[role.code] = [];

			for(let _module in _modules){
				
				permPrefix = _modules[_module].split(',');
				permPrefix.forEach(p => {
					role_permissions[role.code].push({
						role: role.code,
						permission: mapPermission[p] + '_' + _module,
						role_id: 0,
						permission_id: 0
					});
					permissions.push(mapPermission[p] + '_' + _module);
				});
			}
		});
	})
	.then(() => {
		let p = [];
		permissions = removeDups(permissions);
		permissions.forEach(permission => {
			p.push({
				code: permission,
				name: ucwords(permission),
				description: ucwords(permission)
			});
		});
		return knex('permissions').insert(p).then(() => {
			return knex('permissions').then(pm => {
				role_permissions['pm'] = [];
				pm.forEach(perm => {
					role_permissions['pm'][perm.code] = perm.id;
				});
				
			});
		});
	})
	.then(() => {
		role_permissions['data'] = [];
		for (const r in role_permissions) {
			if( r != 'id' && r != 'pm' && r != 'data') {
				role_permissions[r].forEach(rp => {
					const role = rp.role;
					const perm = rp.permission;

					role_permissions['data'].push({
						role_id: role_permissions['id'][role],
						permission_id: role_permissions['pm'][perm]
					});
				});
			}
		}
		return knex('role_permissions').insert(role_permissions['data']);
	});
};

const ucwords = (word) => {
	return word.replace('_', ' ').toLowerCase().replace(/\b[a-z]/g, letter => {
		return letter.toUpperCase();
	});
};

removeDups = (names) => {
	let unique = {};
	names.forEach(function(i) {

	  if(!unique[i]) {
		unique[i] = true;
	  }
	});
	return Object.keys(unique);
};