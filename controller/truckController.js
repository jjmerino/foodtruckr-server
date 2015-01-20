var truckRepository = require('../model/truckRepository');
module.exports.findInRect = function(req,res){
  truckRepository.findInRect(req.params.lat1,req.params.lng1,req.params.lat2,req.params.lng2)
    .then(function(data){
      res.send(data);
    });
};
