
exports.up = function(knex, Promise) {
    return knex.schema.createTable('tokens', table => {
        table.integer('user_id').unsigned();
        table.string('token').notNull();
        table.timestamp('created_at').defaultTo(knex.fn.now());
        table.index('user_id');
        table.foreign('user_id').references('id').inTable('users')
            .onUpdate('cascade').onDelete('cascade');
    })
    .then(() => console.log('Tokens Table is Created!'));
};

exports.down = function(knex, Promise) {
    // Cascade table first
    return knex.schema
        .dropTable('tokens');
};
