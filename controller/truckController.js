/*
 * This module handles the logic for the truck routes
 */


var redisTrucks = require('../model/truckRepository');

module.exports.findInRect = function(req,res){
  var lat1 = +req.params.lat1;
  var lng1 = +req.params.lng1;
  var lat2 = +req.params.lat2;
  var lng2 = +req.params.lng2;
  redisTrucks.findInRect(lat1,lng1,lat2,lng2).then(function(data){
    res.send(data);
  },function(err){
    res.status(500,err);
  });


};
