var q = require('q');
var request = require('request');

/**
 * Finds trucks in the enclosing rectangle by querying the API
 * @param lat1
 * @param lng1
 * @param lat2
 * @param lng2
 * @returns {promise|*|Q.promise}
 */
var findInRect = function(lat1,lng1,lat2,lng2){
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
 * @returns {promise|*|Q.promise}
 */
var findAll = function(){
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
module.exports = {
  findInRect: findInRect,
  findAll: findAll
};

