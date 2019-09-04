
exports.up = (knex, Promise) => {
    return knex.schema.createTable('password_resets', table => {
        table.integer('user_id').unsigned();
        table.string('token').notNull();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.index('user_id');
        table.foreign('user_id').references('id').inTable('users')
            .onUpdate('cascade').onDelete('cascade');
    })
    .then(() => console.log('Password Resets Table is Created!'));
};

exports.down = (knex, Promise) => {
    return knex.schema.dropTable('password_resets');
};
