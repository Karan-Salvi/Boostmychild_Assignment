const mongoose = require("mongoose");
const logger = require("../utils/logger.js");
const dotenv = require("dotenv");
// dotenv configuration
require("dotenv").config();

const DB_connect = async () => {
  try {
    const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);

    if (!connectionInstance) {
      logger.warn("MongoDB connection failed");
    } else {
      logger.info(
        "MongoDB connected successfully : " + connectionInstance.connection.host
      );
    }
  } catch (error) {
    logger.error(
      "MongoDB connection failed due to some error :",
      error.message
    );
  }
};

module.exports = DB_connect;
