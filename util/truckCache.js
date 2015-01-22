/*
 * This module handles periodically fetching the complete truck list and storing it in redis using geohashing.
 * The initialize() function should be called on server start.
 */

var truckRepository = require('../model/truckRepository');
var redisGeohash = require('./redisGeohash');
var client = redisGeohash.client;
var proximity = redisGeohash.proximity;

// fetches all trucks and stores them in redis using geohashing
var preFetch = function(){
  var multi;
  var coordinates = [];
  console.log('Attempting to cache truck locations');
  truckRepository.findAll()
    .then(function(data){

      multi = client.multi();


      for(var i = 0; i < data.length; i++){

        var truck = data[i];
        var truck_id = 'truck:' + truck.objectid;
        if(!truck.objectid||!truck.latitude||!truck.longitude){
          continue;
        }

        multi.set(truck_id, JSON.stringify(truck), function(err){
          coordinates.push([this.truck.latitude,this.truck.longitude, this.truck_id]);
        }.bind({truck:truck, truck_id: truck_id}));
      }

      multi.exec(function( err, replies ){
        if(err){
          console.error('Could not cache locations');
        }
        proximity.addCoordinates(coordinates,function(err, reply){
          if(err){
            console.error('Could not cache locations');
          }
          console.log(coordinates.length + ' locations cached in Redis');
        });
      });

    });

};

/**
 * Initializes the module, which will make it fetch the truck list every hour.
 */
module.exports.initialize = function(){
  // cache into redis every 60 minutes
  preFetch();
  setInterval(preFetch, 60*60*1000);
};
