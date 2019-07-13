
exports.up = (knex, Promise) => {
    return knex.schema.createTable('password_resets', table => {
        table.string('email').notNull();
        table.string('token').notNull();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.index('email');
    })
    .then(() => console.log('Password Resets Table is Created!'));
};

exports.down = (knex, Promise) => {
    return knex.schema.dropTable('password_resets');
};
