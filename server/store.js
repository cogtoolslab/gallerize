"use strict";

const _ = require("lodash");
const bodyParser = require("body-parser");
const express = require("express");
const mongodb = require("mongodb");
const colors = require("colors/safe");

const app = express();
const cors = require('cors');

const whiteList = ['http://cogtoolslab.org:8881','http://159.89.145.228:8881'];

var corsOptions = {

        origin : function (origin, callback){
          if (whiteList.indexOf(origin)!==-1){
                  callback(null,true);
          }
          else{
                  callback(new Error('Not allowed Cors'));
          }
  },
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


const MongoClient = mongodb.MongoClient;
const port = process.env.port || 8887;
const mongoCreds = require("./auth.json");
const mongoURL = `mongodb://${mongoCreds.user}:${mongoCreds.password}@127.0.0.1:27017/gallerize?authSource=admin`
const mongoose = require("mongoose");
mongoose.set('useCreateIndex', true);

function makeMessage(text) {
  return `${colors.blue("[store]")} ${text}`;
}
function log(text) {
  console.log(makeMessage(text));
}

function error(text) {
  console.error(makeMessage(text));
}

function failure(response, text) {
  const message = makeMessage(text);
  console.error(message);
  return response.status(500).send(message);
}

function success(response, text) {
  const message = makeMessage(text);
  console.log(message);
  return response.send(message);
}

function mongoConnectWithRetry(delayInMilliseconds, callback) {
  mongoose.connect(mongoURL, {
    useNewUrlParser: true
  }, (err, connection) => {
    if (err) {
      console.error(`Error connecting to MongoDB: ${err}`);
      setTimeout(
        () => mongoConnectWithRetry(delayInMilliseconds, callback),
        delayInMilliseconds
      );
    } else {
      log("connected succesfully to mongodb");
      callback(connection);
    }
  }
  );
}

//let Draw = require("./models/draw.model");
let Draw = require("./models/collabDraw.model")

function serve() {
  mongoConnectWithRetry(2000, connection => {
    app.use(cors(corsOptions));
    //app.use(cors());
    app.options('*', cors());
    //app.use(cors());
    app.use(express.json());
    console.log('Connected to mongo server.');


    app.post("/db/add", (req, res) => {
      console.log(`In Add.`);
      if (whiteList.indexOf(request.headers.origin) ===-1){
        log("bad origin");
        response.status(401).json("ERROR: BAD ORIGIN, AUTHENTICATION FAILED");
        return;
      }
      const newDraw = new Draw({
        filename: req.body.filename,
        age: req.body.age,
        valid: req.body.valid,
        class: req.body.class
      });

      newDraw
        .save()
        .then(() => res.json("new Draw added!"))
        .catch(err => res.status(400).json("Error: " + err));
    });

    /* Update Data Query */
    app.put("/db/update-data", (request, response) => {
      log("in update data");

         
      if (whiteList.indexOf(request.headers.origin) ===-1){
        log("bad origin");
        response.status(401).json("ERROR: BAD ORIGIN, AUTHENTICATION FAILED");
        return;
      }

      Draw.findOneAndUpdate({
        filename: request.body.filename
      },
        { valid: request.body.valid },
        { new: true },
        (error, result) => {
          if (error) {
            response.status(400).json("Error: " + error);
          }
          else {
            response.status(200).send("valid updated!");
          }
        }
      );
    });

    /* Get all classes query*/
    app.get("/db/get-classes", (request, response) => {
      log("in get-classes");
      log(request.headers.origin); 
        
      if (whiteList.indexOf(request.headers.origin) ===-1){
            log("bad origin");
        response.status(401).json("ERROR: BAD ORIGIN, AUTHENTICATION FAILED");
        return;
      }

      Draw.find().distinct('class',
        function (err, result) {
          if (err) {
            response.status(400).json("Error: " + err);
          }
          else {
            response.status(200).json(result.sort());
          }
        }
      );
    });

    /* Get Data Query */
    app.post("/db/get-data", (request, response) => {
      log("in get-data");
      console.log(request.body);

      if (request.headers.origin !== 'http://159.89.145.228:8881') {
        log("bad origin");
        response.status(401).json("ERROR: BAD ORIGIN, AUTHENTICATION FAILED");
        return;
      }

      const order = request.body.order;
      const range = request.body.ageRange;
      const classes = request.body.classes;
      const validToken = parseInt(request.body.validToken);      //-1 only invalids. 0 unchecked. 1 only valids. 2 for ALL
      let valids = [validToken];
      if (validToken === 2) {
        valids = [-1, 0, 1];
      }
      var sortObject = {
      };
      if (order === "Age (Young - Old) Group By Class") {
        sortObject.age = 1;
        sortObject.class = 1;
      }
      else if (order === "Age (Old - Young) Group By Class") {
        sortObject.age = -1;
        sortObject.class = 1;
      } else if (order === "Class (A - Z) Group By Age") {
        sortObject.class = 1;
        sortObject.age = 1;
      }
      else if (order === "Class (Z - A) Group By Age") {
        sortObject.class = -1;
        sortObject.age = 1;
      }

      Draw.aggregate([
        {
          $match: {
            class: { $in: classes },
            //age: { $gte: parseInt(range[0]), $lte: parseInt(range[1]) },
            valid: { $in: valids }
          }
        },
        {
          $sort: sortObject
        }
      ],
        function (err, result) {
          if (err) {
            response.status(400).json("Error: " + err);
          }
          else {
            response.status(200).json(result);
          }
        }
      );
    });

    app.listen(port, () => {
      log(`running at http://localhost:${port}`);
    });
  });
}

serve();
