const express = require("express");
require("dotenv").config();
const connectToDb = require("./config/db");
const { errorHandler, notFound } = require("./MiddleWare/error");
const bodyParser = require('body-parser')


// Import routes
const auth = require("./routes/auth");

// Init App
const app = express();

// Connection To Db
connectToDb();

//
app.use(express.urlencoded({extended:false}));

// Middlewares
app.use(express.json());

// Routes
app.use("/api/auth", auth);

// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

// Running The Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
