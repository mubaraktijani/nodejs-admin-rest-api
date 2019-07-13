
exports.up = (knex, Promise) => {
    return Promise.all([
        // Create table for storing users
        knex.schema.createTable('users', (table) => {
            table.increments('id').unsigned().primary();
            table.string('name');
            table.string('username').nullable().unique();
            table.string('email').notNull().unique();
            table.string('password');
            table.string('picture').nullable();
            table.string('remember_token').nullable();
            table.timestamp('last_logged_in_at').nullable();
            table.boolean('enabled').default(1);
            table.timestamps(true, true);
        })
        .then(() => console.log('Users Table is Created!')),
    ]); 
};

exports.down = (knex, Promise) => {
    // Cascade table first
    return knex.schema.dropTable('users');
};
