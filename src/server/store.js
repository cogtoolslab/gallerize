'use strict';

const _ = require('lodash');
const bodyParser = require('body-parser');
const express = require('express');
const fs = require('fs');
const mongodb = require('mongodb');
const path = require('path');
const sendPostRequest = require('request').post;
const colors = require('colors/safe');

const app = express();
const MongoClient = mongodb.MongoClient;
const port = 7000;
const mongoCreds = require('./auth.json');
const mongoURL = `mongodb://${mongoCreds.user}:${mongoCreds.password}@localhost:27017/`;
const handlers = {};

function makeMessage(text) {
  return `${colors.blue('[store]')} ${text}`;
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
  MongoClient.connect(mongoURL, (err, connection) => {
    if (err) {
      console.error(`Error connecting to MongoDB: ${err}`);
      setTimeout(() => mongoConnectWithRetry(delayInMilliseconds, callback), delayInMilliseconds);
    } else {
      log('connected succesfully to mongodb');
      callback(connection);
    }
  });
}

function serve() {

  mongoConnectWithRetry(2000, (connection) => {

    app.use(bodyParser.json({limit: "50mb"})); // added bll
    app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));

    app.post('/db/insert', (request, response) => {
      sanity(request, response);
      
      const databaseName = request.body.dbname;
      const collectionName = request.body.colname;
      const database = connection.db(databaseName);
      
      // Add collection if it doesn't already exist
      if (!database.collection(collectionName)) {
        console.log('creating collection ' + collectionName);
        database.createCollection(collectionName);
      }

      const collection = database.collection(collectionName);
      const data = _.omit(request.body, ['colname', 'dbname']);
      // log(`inserting data: ${JSON.stringify(data)}`);
      collection.insert(data, (err, result) => {
        if (err) {
          return failure(response, `error inserting data: ${err}`);
        } else {
          return success(response, `successfully inserted data. result: ${JSON.stringify(result)}`);
        }
      });
    });

    /* Get Data Query */
    app.get('/db/get-data', (request, response) => {
      sanity(request, response);

      const databaseName = request.body.dbname;
      const collectionName = request.body.colname;
      const database = connection.db(databaseName);
      const collection = database.collection(collectionName);
      var resultArray = []

      const order = request.body.order;
      const range = request.body.range;
      const classes = request.body.classes;
      const validToken = request.body.valid; //-1 only invalids. 0 all. 1 only valids

      var cursor = collection.find({
        valid: validToken,
        class: {$in:classes},
        age: {$gte:range[0], $lte:range[1]}
      });//.sort(order); NEED MORE LOGIC HERE. OR WE CAN DO SORTING ON FRONT END

      cursor.forEach(function(doc, err){
        if (error){
          return failure(response, `error inserting data: ${err}`);
        }
        else{
          resultArray.push(doc);
        }
      }, function(){
        response.render('index', {items: resultArray});
      });
    });


    app.listen(port, () => {
      log(`running at http://localhost:${port}`);
    });
    
  });
  
}
function sanity(request, response){
  if (!request.body) {
    return failure(response, '/db/insert needs post request body');
  }
  log(`got request to insert into ${request.body.colname}`);
  
  const databaseName = request.body.dbname;
  const collectionName = request.body.colname;
  if (!collectionName) {
    return failure(response, '/db/insert needs collection');
  }
  if (!databaseName) {
    return failure(response, '/db/insert needs database');
  }
}

serve();