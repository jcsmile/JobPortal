// File: server.js

const express = require("express");
const logger = require("./api/utils/logger");  // Import Winston logger
const routes = require("./api/routes/jobPostings");
const cors = require('cors');
const { PORT, MONGO_URI, LOG_LEVEL } = require("./api/utils/constants");

const app = express();
app.use(cors({
    origin: 'http://localhost:3000', // Allow only localhost:3000
    // origin: '*',                   // Allow requests from any origin (use carefully)
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));
// Middleware to parse JSON
app.use(express.json());

// HTTP logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.url} - ${req.ip}`);
    next();
});

app.use("/api", routes);

// Default route
app.get("/", async (req, res) => {
    try {
        res.json({
            message: "Hello, the server is working! Use /api/jobs to access API."
        });

    } catch (err) {
        logger.error("Error in root endpoint: %o", err);
        res.status(500).json({ message: "Server Error in the root endpoint." });
    }
});

// Start the server
app.listen(PORT, () => {
    logger.info(`Logger Level ${LOG_LEVEL}`)
    logger.info(`Server running on port ${PORT}`);
    logger.debug(`MongoDB URI: ${MONGO_URI}`);
});
