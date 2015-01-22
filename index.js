/*
 * FoodTruckr - Server.
 * See the readme for a detailed description of this application
 */

var express = require('express'),
  config = require('./config'),
  app = express(),
  truckController = require('./controller/truckController'),
  TruckCache = require('./util/truckCache');

if(config.port === undefined){
  console.error('Please source appropiate .env file before running');
  return;
}

// enable cors access
app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin','*');
  next();
});

// configure routes to the controllers
app.get('/findInRect/:lat1/:lng1/:lat2/:lng2', truckController.findInRect);

// geohashes trucks into redis
var truckCache = new TruckCache();
truckCache.initialize();

app.listen(config.port,function(){
  console.log('Listening on port ', config.port);
});

module.exports = app;

