'use strict';

require('dotenv').config();

module.exports = {

	development: {
		/*
        |--------------------------------------------------------------------------
        | Default Database Connection Name
        |--------------------------------------------------------------------------
        |
        | Here you may specify which of the database connections below you wish
        | to use as your default connection for all database work. Of course
        | you may use many connections at once using the Database library.
        |
        */
        client          : process.env.DB_DIALECT    || 'mysql2',

        /*
        |--------------------------------------------------------------------------
        | Database Connections
        |--------------------------------------------------------------------------
        |
        | Here are each of the database connections setup for your application.
        | Of course, examples of configuring each database platform that is
        | supported by Laravel is shown below to make development simple.
        |
        |
        | All database work in Laravel is done through the PHP PDO facilities
        | so make sure you have the driver for your particular database of
        | choice installed on your machine before you begin development.
        |
        */
        connection: {
            host        : process.env.DB_HOST       || 'localhost',
            port        : process.env.DB_PORT       || '3306',
            database    : process.env.DB_NAME       || 'forge',
            user        : process.env.DB_USER       || 'forge',
            password    : process.env.DB_PASSWORD   || '',
        },

		migrations: {
            directory: './database/migrations',
			tableName: 'knex_migrations'
        },
        
		seeds: {
			directory: './database/seeds'
		}
	},

	production: {
        client: 'postgresql',
        
		connection: {
			database: 'my_db',
			user:     'username',
			password: 'password'
		},
        
		migrations: {
			directory: './../../database/migrations'
        },
        
		seeds: {
			directory: './../../database/seeds'
		}
	}
};