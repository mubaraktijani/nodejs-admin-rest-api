'use strict';

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, colorize, simple, errors, splat } = format;

const createTransports = function (config) {
    const customTransports = [];
  
    // setup the file transport
    if (config.file) {
  
        // setup the log transport
        customTransports.push(
            new transports.File({
                filename: config.file,
                level: config.level,
                json: false,
                prettyPrint: true,
            })
        );
    }

    // if config.console is set to true, a console logger will be included.
    if (config.console) {
        customTransports.push(
            new transports.Console({
                level: config.level,
                format: combine(
                    colorize(),
                    simple()
                )
            })
        );
    }

    return customTransports;
};

module.exports = {
    create: (config) => {
        return createLogger({

            level: config.level,

            exitOnError: false,

            format: combine(
                label({label: config.NAME}),
                timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                errors({ stack: true }),
                splat(), 
                simple()
            ),

            transports: createTransports(config)
        });
    }
};