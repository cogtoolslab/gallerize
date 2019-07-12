const express = require("express");
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const port = process.env.port||5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
});


app.listen(port, () => {
    console.log(`running at http://localhost:${port}`);
});

