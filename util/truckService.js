var q = require('q');
var request = require('request');
var Truck = require('../model/truckEntity');
/**
 * Fetches all trucks. Use sparingly. returns a Truck entity array
 */
exports.findAll = function(){
  var d = q.defer();

  // Query construction
  var qs = 'https://data.sfgov.org/resource/rqzj-sfat.json';
  request(qs,
    function (err, res) {
      if(err){
        console.error(err);
        return d.reject(err);
      }
      // parse the trucks using our Truck entity
      d.resolve(JSON.parse(res.body).map(function(truck){
        return new Truck(truck);
      }));
    }
  );
  return d.promise;
};

