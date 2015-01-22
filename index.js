/*
 * FoodTruckr - Server.
 * See the readme for a detailed description of this application
 */

var express = require('express'),
  config = require('./config'),
  app = express(),
  truckController = require('./controller/truckController')
  truckCache = require('./util/truckCache');

if(config.port === undefined){
  console.error('Please source appropiate .env file before running');
  return;
}

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin','*');
  next();
});

// Routes
app.get('/findInRect/:lat1/:lng1/:lat2/:lng2', truckController.findInRect);

// geohashes trucks into redis
truckCache.initialize();

app.listen(config.port,function(){
  console.log('Listening on port ', config.port);
});
