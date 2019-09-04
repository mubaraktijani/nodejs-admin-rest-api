'use strict';

const {
    createLogger,
    format,
    transports
} = require('winston');
const {
    combine,
    timestamp,
    label,
    colorize,
    simple,
    errors,
    splat
} = format;

const DevLevels = ['warn', 'info', 'http', 'silly', 'debug', 'verbose'];
const testLevels = ['error'];

const createTransports = function (config) {
    const customTransports = [];

    // setup the file transport
    if (config.File) {
        let path = config.File.replace(config.File.split('/').pop(), '');
        
        // setup the log transport
        customTransports.push(
            new transports.File({
                levels: DevLevels,
                filename: config.File,
                json: false,
                prettyPrint: true,
                format: combine(
                    colorize(),
                ),
            })
        );

        testLevels.forEach(level => customTransports.push(
            new transports.File({
                level: level,
                filename: `${path}${level}s.log`,
                json: false,
                prettyPrint: true,
                format: combine(
                    colorize(),
                )
            })
        ));
    }

    // if config.console is set to true, a console logger will be included.
    if (config.Console && process.env.NODE_ENV !== 'test') {
        customTransports.push(
            new transports.Console({
                level: config.Level,
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
    create: (options) => {
        return createLogger({

            level: options.Level,

            exitOnError: false,

            format: combine(
                timestamp({
                    format: 'YYYY-MM-DD HH:mm:ss'
                }),
                errors({
                    stack: true
                }),
                splat(),
                simple()
            ),

            transports: createTransports(options)
        });
    }
};