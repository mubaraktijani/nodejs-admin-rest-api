'use strict',

require('dotenv').config();

module.exports = {
    file        : process.env.LOG_PATH,
    level       : process.env.LOG_LEVEL || 'info',
    console     : process.env.LOG_ENABLE_CONSOLE || true
};