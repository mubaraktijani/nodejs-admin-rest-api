exports.up = (knex, Promise) => {
    return Promise.all([

        // Create table for storing permissions
        knex.schema.createTable('subscriptions', (table) => {
            table.increments('id').unsigned().primary();
            table.string('name').notNull().unique();
            table.string('description').nullable();
            table.integer('price').notNull().default(0);
            table.integer('free_trail_days').notNull().default(0);
            table.integer('month').notNull().default(0);
            table.boolean('enabled').notNullable().default(true);
            table.index(['id']);
            table.timestamps(true, true);
        })
        .then(() => console.log('Subscriptions Table is Created!')),

        // Create table for storing permissions
        knex.schema.createTable('subscription_meta', (table) => {
            table.increments('id').unsigned().primary();
            table.integer('subscription_id').unsigned();
            table.string('key').notNull().unique();
            table.string('value').nullable();
            table.index(['id', 'subscription_id', 'key']);
            table.timestamps(true, true);

            table.foreign('subscription_id').references('id').inTable('subscriptions')
                .onUpdate('cascade').onDelete('cascade');
        })
        .then(() => console.log('Subscription Meta Table is Created!')),

        // Create table for associating permissions to roles (Many-to-Many)
        knex.schema.createTable('user_subscription', (table) => {
            table.increments('id').unsigned().primary();
            table.integer('user_id').unsigned();
            table.integer('subscription_id').unsigned();
            table.string('token').notNullable();
            table.boolean('is_active').notNullable().default(true);
            table.index(['user_id', 'subscription_id']);
            table.timestamps(true, true);

            table.foreign('user_id').references('id').inTable('users')
                .onUpdate('cascade').onDelete('cascade');

            table.foreign('subscription_id').references('id').inTable('subscriptions')
                .onUpdate('cascade').onDelete('cascade');
        })
        .then(() => console.log('User Subscription Table is Created!')),
    ]);
};

exports.down = (knex, Promise) => {
    // Cascade table first
    return knex.schema
        .dropTable('user_subscription')
        .dropTable('subscription_meta')
        .dropTable('subscriptions');
};
