var q = require('q');
var request = require('request');
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
      if(err){return d.reject(err);}

      d.resolve(res.body);
    }
  );
  return d.promise;
};

module.exports = {
  findInRect: findInRect
};

