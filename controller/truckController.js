var truckRepository = require('../model/truckRepository'),
  redis = require('redis'),
  client = redis.createClient(),
  proximity = require('geo-proximity')
    .initialize(client,"truck:locations");


//fetches all trucks and stores them in redis using geohashing
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

// cache into redis every 60 minutes
preFetch();
setInterval(preFetch, 60*60*1000);

module.exports.findInRect = function(req,res){

  var multi;
  var lat1 = +req.params.lat1;
  var lng1 = +req.params.lng1;
  var lat2 = +req.params.lat2;
  var lng2 = +req.params.lng2;
  var center = [(lat1 + lat2)/2,(lng1 + lng2)/2];

  var dist = distance(lat1,lng1,lat2,lng2)*500;

  proximity.query(center[0],center[1],dist, function(err, idList){
    if(err){ console.log(err); }

    multi = client.multi();

    idList.forEach(function(truckid){
      multi.get(truckid);
    });

    multi.exec(function(err, truckList){
      if(err){
        console.error(err);
        return;
      }
      var result = truckList.map(function(truck){
        return JSON.parse(truck);
      });

      res.send(result);
    })
  });

};

function distance(lat1, lon1, lat2, lon2) {
  var radlat1 = Math.PI * lat1/180;
  var radlat2 = Math.PI * lat2/180;
  var radlon1 = Math.PI * lon1/180;
  var radlon2 = Math.PI * lon2/180;
  var theta = lon1-lon2;
  var radtheta = Math.PI * theta/180;
  var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  dist = Math.acos(dist);
  dist = dist * 180/Math.PI;
  dist = dist * 60 * 1.1515 * 1.609344;
  return dist;
}
