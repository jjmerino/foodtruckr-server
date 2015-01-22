var EventEmitter =  require('events').EventEmitter;
var truckService = require('./truckService');
var redisGeohash = require('./redisGeohash');
var client = redisGeohash.client;
var proximity = redisGeohash.proximity;
var _ = require('lodash');

/**
 * Handles periodically fetching the complete truck list and storing it in redis using geohashing.
 * The initialize() method should be called on server start.
 */
var TruckCache = function() {
  this.interval = null;
};

// handles callbacks for consistent error handling
var _ifSuccessful = function(callback){
  return function(err, data){
    if(err){
      console.error('Could not cache trucks. Error: $s', err);
      return;
    }
    callback(data);
  }
};

TruckCache.prototype = Object.create(EventEmitter.prototype);

TruckCache.prototype.constructor = TruckCache;

TruckCache.prototype._persistTrucks = function(trucks){
  // start transaction
  var multi = client.multi();

  var coordinates = [];

  trucks.forEach(function(truck) {
    var truckId = 'truck:' + truck.objectid;

    if(_.any([truck.objectid,truck.latitude,truck.longitude], _.isUndefined)){
      return;
    }
    multi.set(truckId, JSON.stringify(truck), _ifSuccessful(function(){
        coordinates.push([this.truck.latitude,this.truck.longitude, this.truckId]);
      }.bind({truck:truck, truckId: truckId})
    ));
  });

  // execute transaction
  multi.exec(_ifSuccessful(function(){
    proximity.addCoordinates(coordinates,_ifSuccessful(function(){
      console.log(coordinates.length + ' locations cached in Redis');
    }));
  }));
};

/**
 * fetches all trucks and stores them in redis
 */
TruckCache.prototype.preFetch = function() {
  console.log('Attempting to cache truck locations');
  truckService.findAll().then(this._persistTrucks);
};

/**
 * Initializes the module, which will make it fetch the truck list every hour.
 */
TruckCache.prototype.initialize = function() {
  this.preFetch();

  this.on('update', this.preFetch);
  // trigger update event every 60 minutes
  this.interval = setInterval(function() {
    this.emit('update');
  }.bind(this), 60 * 60 * 1000);
};

/**
 * Stops fetching from the API
 */
TruckCache.prototype.end = function() {
  this.removeAllListeners('update');
  clearInterval(this.interval);
};

module.exports = TruckCache;
