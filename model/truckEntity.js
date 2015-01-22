/**
 *  Defines a schema for mapping the api truck to the one we are storing
 */
var Truck = function(data){

  this.status = data.status;
  this.objectid = data.objectid;
  this.latitude = data.latitude;
  this.longitude = data.longitude;
  this.applicant = data.applicant;
  this.fooditems = data.fooditems;

};

Truck.prototype.serialize = function(){
  return JSON.stringify(this);
};

module.exports = Truck;