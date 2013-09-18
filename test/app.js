/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , mocha = require('mocha')
  , request = require('supertest')
  , app = require('../server')
  , context = describe
  , City = mongoose.model('City')
  , agent = request.agent(app);
  

describe('Application', function () {
  before(function(done){ 
    City.count({}, function(err,count){
      should.not.exist(err);
      count.should.equal(5565);
    });
    done();
  })
  
  describe('GET /', function(){
    // it('should list cities', function(done){
    //   request(app)
    //     .get('/')
    //     .end(function(err,res){
    //       res.text.should.include('São Paulo');
    //       done();
    //     });        
    // })
  })
  
  

  // context('with no cities loaded', function() {
  //   before(function(done){
  //     City.find().remove();
  //     City.count({}, function(err,count){
  //       should.not.exist(err);
  //       count.should.equal(5563);
  //     });
  //     done();
  //   })
  //   
  //   describe('GET /',  function() {
  //     it('should link to setup page', function(done){
  //       request(app)
  //         .get('/')
  //         .end(function(err,res){
  //           res.text.should.include('página de inicialização');
  //           done();
  //         });        
  //     })
  //   })
  //   
  //   describe('GET /inicializacao',  function() {
  //     it('should load cities csv.', function(done){
  //       request(app)
  //         .get('/inicializacao')
  //         .end(function(err,res){
  //           City.count()
  //           res.text.should.include('página de inicialização');
  //           done();
  //         });        
  //     })
  //   })
  //   
  //   
  // })
  

})