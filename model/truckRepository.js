var q = require('q');
var distance = require('../util/geomath').distance;
var redisGeohash = require('../util/redisGeohash');
/**
 * This module provides an abstraction layer to query the cached trucks from redis.
 */
var TruckRepository = function(redisGeohash){
  this.proximity = redisGeohash.proximity;
  this.client = redisGeohash.client;
};

/**
 * Finds trucks in the enclosing rectangle by querying redis
 */
TruckRepository.prototype.findInArea = function(lat1,lng1,lat2,lng2){

  var d = q.defer();
  var multi;
  var center = [(lat1 + lat2)/2,(lng1 + lng2)/2];
  var dist = distance(lat1,lng1,lat2,lng2)*500;

  this.proximity.query(center[0],center[1],dist, function(err, idList){
    if(err){ console.log(err); }
    multi = this.client.multi();
    idList.forEach(function(truckid){
      multi.get(truckid);
    });
    multi.exec(function(err, truckList){
      if(err){
        d.reject(err);
        return;
      }
      var result = truckList.map(function(truck){
        return JSON.parse(truck);
      });
      d.resolve(result);
    })
  }.bind(this));
  return d.promise;
};

module.exports = new TruckRepository(redisGeohash);

