var express = require('express'),
  config = require('./config'),
  app = express(),
  truckController = require('./controller/truckController');

if(config.port === undefined){
  console.error('Please source appropiate .env file before running');
  return;
}

// Import truck repository
var truckRepository = require('./model/truckRepository');

app.use(function(req, res, next){
  res.header('Access-Control-Allow-Origin','*');
  next();
});

// Routes
app.get('/findInRect/:lat1/:lng1/:lat2/:lng2', truckController.findInRect);

app.listen(config.port,function(){
  console.log('Listening on port ', config.port);
});
