"use strict";

const _ = require("lodash");
const bodyParser = require("body-parser");
const express = require("express");
const mongodb = require("mongodb");
const colors = require("colors/safe");
const argv = require('minimist')(process.argv.slice(2));
const app = express();
const cors = require('cors');
const https = require('https');
const fs = require('fs');

let gameport;
if (argv.gameport) {
  gameport = argv.gameport;
  log('using port ' + gameport);
} else {
  gameport = 8887;
  log('no gameport specified: using 8887\nUse the --gameport flag to change');
}

// const whiteList = ['http://cogtoolslab.org:8881','http://159.89.145.228:8881'];
const whiteList = ['https://138.68.25.178:8883', 'https://stanford-cogsci.org:8883'];

var corsOptions = {

  origin: function (origin, callback) {
    log(origin);
    if (whiteList.indexOf(origin) !== -1) {
      log("allowed cors")
      callback(null, true);
    }
    else {
      callback(new Error('Not allowed Cors'));
    }
  },
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

const port = gameport;
const mongoCreds = require("./auth.json");
// const mongoURL = `mongodb://${mongoCreds.user}:${mongoCreds.password}@127.0.0.1:27017/gallerize?authSource=admin`
const mongoURL = `mongodb://${mongoCreds.user}:${mongoCreds.password}@127.0.0.1:27017/kiddraw?authSource=admin`
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

function markAnnotation(model, gameid, drawings) {
  let id_list = drawings.map(x => mongoose.Types.ObjectId(x._id));
  log(id_list)

  model.updateMany(
    { _id: { $in: id_list } },
    {
      $push: { games: 'abc' }
    },
    function (err, items) {
      log(items)
      if (err) {
        log(`error marking annotation data: ${err}`);
      } else {
        log(`successfully marked annotation. result: ${JSON.stringify(items)}`);
      }
    });
};

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
let Draw = require("./models/draw.model")
let Response = require("./models/response.model")

function serve() {
  mongoConnectWithRetry(2000, connection => {
    app.use(cors());
    app.use(express.json());
    console.log('Connected to mongo server.');


    app.post("/db/add", cors(corsOptions), (req, res) => {
      console.log(`In Add.`);
      
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
    app.put("/db/update-data", cors(corsOptions), (request, response) => {
      log("in update data");

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
    app.get("/db/get-classes", cors(corsOptions), (request, response) => {
      log("in get-classes");

      Draw.find().distinct('class',
        function (err, result) {
          if (err) {
            log(err)
            response.status(400).json("Error: " + err);
          }
          else {
            response.status(200).json(result.sort());
          }
        }
      );
    });

    app.post("/db/get-single-class", cors(corsOptions), (request, response) => {
      log("get single class");
      log(request.body);

      Draw.aggregate([
        { $addFields: { numGames: { $size: '$games' } } },
        { $match: { class: request.body.class } },
        { $sort: { numGames: 1, shuffler_ind: 1 } },
        { $limit: request.body.num }
      ],
        function (err, result) {
          if (err) {
            response.status(400).json("Error: " + err);
          }
          else {
            response.status(200).json(result);
            //request.body.mturk_id
            markAnnotation(Draw, 'abc', result);
          }
        }
      );
    })

    app.post("/db/post-response", cors(corsOptions), (request, response) => {
      log("in post-response");

      const newResponses = request.body.map(x => {
        return new Response(x)
      })

      Response.insertMany(newResponses, function (error) {
        if (error) {
          log(error)
          response.status(400).json("Error: " + error)
        } else {
          response.status(200).json("new Responses added!")
        }
      });
    });

    /* Get Data Query */
    app.post("/db/get-data", cors(corsOptions), (request, response) => {
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
            // valid: { $in: valids }
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
    
    app.use(express.static('./../build'));
      
    try {
      var privateKey  = fs.readFileSync('/etc/apache2/ssl/stanford-cogsci.org.key'),
          certificate = fs.readFileSync('/etc/apache2/ssl/stanford-cogsci.org.crt'),
          intermed    = fs.readFileSync('/etc/apache2/ssl/intermediate.crt'),
          options     = {key: privateKey, cert: certificate, ca: intermed};
       https.createServer(options, app).listen(port);
       log(`server running at https://localhost:` + port);
    } catch (err) {
      console.log(err);
      console.log("cannot find SSL certificates; falling back to http");
      app.listen(port, () => {
          log(`server running at http://localhost:`+port);
        });
    }
  });
}

serve();
