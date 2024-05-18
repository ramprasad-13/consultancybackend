const mongoose = require("mongoose");
require('dotenv').config();

const url = process.env.URL;

mongoose.connect(url)
  .then(() => {
    console.log("Successfully connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });
