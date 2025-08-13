const morgan = require('morgan');
const winston = require('winston');

// Create Winston logger
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || 'info',
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json()
    ),
    defaultMeta: { service: 'bitcoin-yield-optimizer' },
    transports: [
        new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
        new winston.transports.File({ filename: 'logs/combined.log' })
    ]
});

// Add console logging in development
if (process.env.NODE_ENV !== 'production') {
    logger.add(new winston.transports.Console({
        format: winston.format.simple()
    }));
}

// Custom Morgan format
const morganFormat = ':method :url :status :res[content-length] - :response-time ms';

// Morgan middleware
const morganMiddleware = morgan(morganFormat, {
    stream: {
        write: (message) => logger.http(message.trim())
    }
});

module.exports = {
    logger,
    morganMiddleware
};