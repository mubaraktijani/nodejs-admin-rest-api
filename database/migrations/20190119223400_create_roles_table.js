
exports.up = (knex, Promise) => {
    return Promise.all([
        // Create table for storing roles
        knex.schema.createTable('roles', (table) => {
            table.increments('id').unsigned().primary();
            table.string('code').notNull().unique();
            table.string('name').notNull().unique();
            table.string('description').nullable();
            table.enu('status', ['0', '1']).notNullable().default('1');
            table.timestamps(true,true);
        })
        .then(() => console.log('Roles Table is Created!')),

        // Create table for associating roles to users (Many To Many Polymorphic)
        knex.schema.createTable('user_roles', (table) => {
            table.integer('user_id').unsigned();
            table.integer('role_id').unsigned();
            table.enu('status', ['0', '1']).notNullable().default('1');
            table.primary(['user_id', 'role_id']);
            // table.foreign('role_id').references('roles.id');
            table.foreign('role_id').references('id').inTable('roles')
                .onUpdate('cascade').onDelete('cascade');
        })
        .then(() => console.log('User Roles Table is Created!')),

        // Create table for storing permissions
        knex.schema.createTable('permissions', (table) => {
            table.increments('id').unsigned().primary();
            table.string('code').notNull().unique();
            table.string('name').notNull().unique();
            table.string('description').nullable();
            table.timestamps(true,true);
        })
        .then(() => console.log('Permissions Table is Created!')),

        // Create table for associating permissions to roles (Many-to-Many)
        knex.schema.createTable('role_permissions', (table) => {
            table.integer('role_id').unsigned();
            table.integer('permission_id').unsigned();
            table.primary(['role_id', 'permission_id']);

            table.foreign('role_id').references('id').inTable('roles')
                .onUpdate('cascade').onDelete('cascade');

            table.foreign('permission_id').references('id').inTable('permissions')
                .onUpdate('cascade').onDelete('cascade');
        })
        .then(() => console.log('Role Permissions Table is Created!')),
    ]);
};

exports.down = (knex, Promise) => {
    // Cascade table first
    return knex.schema
        .dropTable('role_permissions')
        .dropTable('permissions')
        .dropTable('user_roles')
        .dropTable('roles');
};
