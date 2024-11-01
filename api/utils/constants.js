const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, `../../.env.${process.env.NODE_ENV}`) });

console.log(process.env.NODE_ENV);
module.exports = {
    PORT: process.env.PORT || 3000,
    MONGO_URI: process.env.MONGO_URI || "",
    NODE_ENV: process.env.NODE_ENV || "development",
    LOG_LEVEL: process.env.LOG_LEVEL || "info"
};
