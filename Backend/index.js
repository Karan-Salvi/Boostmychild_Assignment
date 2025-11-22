const express = require("express");
const dotenv = require("dotenv");
const logger = require("./utils/logger.js");
const DB_connect = require("./database/DB_connect.js");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();

const app = express();

const corsOptions = {
  origin: process.env.FRONTEND_URI,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

const PORT = process.env.PORT || 8000;

DB_connect();

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is Running on Port: " + PORT);
});

app.listen(PORT, () => {
  logger.info("Server is Running on Port: " + PORT);
});
