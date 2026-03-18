// backend/src/utils/logger.js
import winston from "winston";

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
    )
  ),
  transports: [
    new winston.transports.File({
      filename: "logs/error.log",
      level: "error",
      maxsize: 5 * 1024 * 1024,
      maxFiles: 5,
      tailable: true,
    }),
    new winston.transports.File({
      filename: "logs/combined.log",
      maxsize: 10 * 1024 * 1024,
      maxFiles: 10,
      tailable: true,
    }),
  ],
});

logger.add(
  new winston.transports.Console({
    level: process.env.NODE_ENV === "production" ? "info" : "debug",
    format:
      process.env.NODE_ENV === "production"
        ? winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp(),
            winston.format.printf(
              ({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`
            )
          )
        : winston.format.simple(),
  })
);

export default logger;
