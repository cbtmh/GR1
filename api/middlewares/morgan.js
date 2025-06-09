const morgan = require('morgan');

const morganMiddleware = morgan('dev'); // Use 'dev' format for concise logging

module.exports = morganMiddleware;