const { createLogger, format, transports } = require("winston");
const { LOG_LEVEL } = require("../utils/constants");
const logger = createLogger({
  level: LOG_LEVEL,  // Default logging level; change to 'debug' or 'error' as needed
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.splat(),
    format.json()  // Use JSON format for structured logging
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: "logs/error.log", level: "error" }),
    new transports.File({ filename: "logs/combined.log" })
  ]
});

module.exports = logger;
