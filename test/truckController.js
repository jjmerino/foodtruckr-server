var expect = require('chai').expect;
var request = require('supertest');
var app = require('./../index.js');
var truckController = require('../controller/truckController.js');
describe('truckController', function(){

  it('should have a findInArea function', function(){
    expect(typeof truckController.findInArea).to.equal('function');
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