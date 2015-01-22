var q = require('q');
var request = require('request');

/**
 * Fetches all trucks. Use sparingly.
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
      d.resolve(JSON.parse(res.body));
    }
  );
  return d.promise;
};

