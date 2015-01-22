var q = require('q');
var request = require('request');

/**
 * Provides an abstraction layer to query the DataSF foot trucks api
 */
var TruckService = function(){

};
/**
 * Finds trucks in the enclosing rectangle by querying the API
 */
TruckService .prototype.findInArea = function(lat1,lng1,lat2,lng2){
  var d = q.defer();

  // Query construction
  var qs = 'https://data.sfgov.org/resource/rqzj-sfat.json?$where='+
    'latitude > ' + +lat1 +
    ' AND latitude < ' + +lat2 +
    ' AND longitude > ' + +lng1 +
    ' AND longitude < ' + +lng2;

  request(qs,
    function (err, res) {
      if(err){
        console.error(err);
        return d.reject(err);
      }

      d.resolve(JSON.parse(res.body));
    }
  );
  return d.promise;
};
/**
 * Fetches all trucks. Use sparingly.
 */
TruckService .prototype.findAll = function(){
  var d = q.defer();

  // Query construction
  var qs = 'https://data.sfgov.org/resource/rqzj-sfat.json';
  request(qs,
    function (err, res) {
      if(err){
        console.error(err);
        return d.reject(err);
      }
      d.resolve(JSON.parse(res.body));
    }
  );
  return d.promise;
};
module.exports = new TruckService();

