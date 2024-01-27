const express = require("express");
require("dotenv").config();
const connectToDb = require("./config/db");
const { errorHandler, notFound } = require("./MiddleWare/error");
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const photoUpload = require('./MiddleWare/photoUpload')
const cors = require("cors");
const auth = require('./routes/auth')
// Init App
const app = express();

  // Connection To Db
  connectToDb();


app.use(cors({
  origin: '*' // origin: 'http://localhost:3000'
}))

app.use(cookieParser())
app.use(cors({credentials: true, origin: true, withCredentials: true }))


// for parsing multipart/form-data
app.use(photoUpload.any()); 
// for parsing application/json
app.use(bodyParser.json()); 
// for parsing application/xwww-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); 
//
app.use(express.urlencoded({extended:false}));
app.use(express.json());

// Routes
app.use("/api/auth", auth);

// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);


app.use("/", (req, res) => {
  res.send("Welcome to our dental care website")
});
// Running The Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
);
