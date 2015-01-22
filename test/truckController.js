var expect = require('chai').expect;
var request = require('supertest');
var app = require('./../index.js');
console.log(app);
var truckController = require('../controller/truckController.js');
describe('truckController', function(){

  it('should have a findInRect function', function(){
    expect(typeof truckController.findInRect).to.equal('function');
  });
});

describe('GET /findInRect/...', function(){

  it('should fetch rects from redis', function(done){

    request(app)
      .get('/findInRect/37.75419228778776/-122.42421627044679/37.775226388320405/-122.39735126495361')
      .expect(200)
      .end(function(err,res){
        expect(res.body.length).to.be.above(10);
        done();
      });

  });

});