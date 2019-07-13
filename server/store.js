"use strict";

const _ = require("lodash");
const bodyParser = require("body-parser");
const express = require("express");
const mongodb = require("mongodb");
const colors = require("colors/safe");

const app = express();
const MongoClient = mongodb.MongoClient;
const port = process.env.port || 7000;
const mongoCreds = require('./auth.json');
//const mongoURL = `mongodb://${mongoCreds.user}:${mongoCreds.password}@localhost:27017`;
//const mongoURL = `mongodb//yiy142:1997728yy@gallerize-pfiji.mongodb.net/test?retryWrites=true&w=majority`;
const mongoURL = `mongodb://localhost:27017`;

const mongoose = require('mongoose');
const cors = require('cors');

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
  //mongoose.connect(mongoURL, { useNewUrlParser: true, useCreateIndex: true }, (err, connection) => {
  MongoClient.connect(mongoURL, { useNewUrlParser: true}, (err, connection) => {
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
  });
}
let Draw = require('./models/draw.model');
function serve() {
  mongoConnectWithRetry(2000, connection => {
    app.use(cors());
    app.use(express.json());
    //app.use(bodyParser.json({ limit: "50mb" })); // added bll
    //app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

    app.post("/db/insert", (request, response) => {
      if (!request.body) {
        return failure(response, "/db/insert needs post request body");
      }
      log(`got request to insert into ${request.body.colname}`);

      const databaseName = request.body.dbname;
      const collectionName = request.body.colname;

      if (!collectionName) {
        return failure(response, "/db/insert needs collection");
      }
      if (!databaseName) {
        return failure(response, "/db/insert needs database");
      }

      const database = connection.db(databaseName);

      // Add collection if it doesn't already exist
      if (!database.collection(collectionName)) {
        console.log("creating collection " + collectionName);
        database.createCollection(collectionName);
      }

      const collection = database.collection(collectionName);
      const data = _.omit(request.body, ["colname", "dbname"]);
      // log(`inserting data: ${JSON.stringify(data)}`);
      collection.insert(data, (err, result) => {
        if (err) {
          return failure(response, `error inserting data: ${err}`);
        } else {
          return success(
            response,
            `successfully inserted data. result: ${JSON.stringify(result)}`
          );
        }
      });
    });

    app.post("/db/add", (req, res) => {
      console.log(req.body);

      const filename = req.body.filename;
      const age = req.body.age;
      const valid = req.body.valid;
      const _class = req.body.class;

      const newDraw = new Draw({ filename: filename, age: age, valid: valid, class: _class });
      
      /* If we want to use mongoose */ 
      newDraw.save().then(() => res.json('new Draw added!'))
        .catch(err => res.status(400).json('Error: ' + err));;
      
     /*
     const databaseName = req.body.dbname;
     const collectionName = req.body.colname;
     
     const database = connection.db(databaseName);
     const collection = database.collection(collectionName);
     
     if (!database.collection(collectionName)) {
      console.log("creating collection " + collectionName);
      database.createCollection(collectionName);
    }

     collection.insert(newDraw, (err, result) => {
      if (err) {
        return failure(res, `error inserting data: ${err}`);
      } else {
        return success(
          res,
          `successfully inserted data. result: ${JSON.stringify(result)}`
        );
      }
    });
    */
    }
    
    );
    /* Get Data Query */
    app.get("/db/get-data", (request, response) => {
      if (!request.body) {
        return failure(response, "/db/insert needs post request body");
      }
      log(`got request to insert into ${request.body.colname}`);

      const databaseName = request.body.dbname;
      const collectionName = request.body.colname;
      if (!collectionName) {
        return failure(response, "/db/insert needs collection");
      }
      if (!databaseName) {
        return failure(response, "/db/insert needs database");
      }

      const database = connection.db(databaseName);
      const collection = database.collection(collectionName);
      var resultArray = [];

      const order = request.body.order;
      const range = request.body.range;
      const classes = request.body.classes;
      //-1 only invalids. 0 unchecked. 1 only valids. 2 for ALL
      const validToken = request.body.valid;
      let cursor;
      if (validToken === 2) {
        cursor = collection.find({
          class: { $in: classes },
          age: { $gte: range[0], $lte: range[1] }
        }, (err, result) => {
          if (err) {
            return failure(response, `error inserting data: ${err}`);
          } else {
            return success(
              response,
              `successfully find data. result: ${JSON.stringify(result)}`
            );
          }
        }); //.sort(order); NEED MORE LOGIC HERE. OR WE CAN DO SORTING ON FRONT END
      } else {
        cursor = collection.find({
          valid: validToken,
          class: { $in: classes },
          age: { $gte: range[0], $lte: range[1] }
        }, (err, result) => {
          if (err) {
            return failure(response, `error inserting data: ${err}`);
          } else {
            return success(
              response,
              `successfully find data. result: ${JSON.stringify(result)}`
            );
          }
        }); //.sort(order); NEED MORE LOGIC HERE. OR WE CAN DO SORTING ON FRONT END
      }
      cursor.forEach((item) => { resultArray.push(item); });
    });



    app.listen(port, () => {
      log(`running at http://localhost:${port}`);
    });
  });
}

serve();
