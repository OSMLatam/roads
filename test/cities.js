/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , should = require('should')
  , mocha = require('mocha')
  , request = require('supertest')
  , app = require('../server')
  , context = describe
  , City = mongoose.model('City');
  // , agent = request.agent(app);
  
describe('Cities properties', function(){
  // remove existing cities
  beforeEach(function(done){
    City.find().remove();
    City.count({}, function(err,count){
      should.not.exist(err);
      count.should.equal(0);
    });
    done();
  })
  
  // timeout to 10s
  this.timeout(10000);

  it('should have IBGE properties', function(){
    a_city = new City({
      ibge:{
        id:'2512754',
        lon: -35.669257,
        lat: -7.253472,
        name: 'Riachão do Bacamarte',
        uf: 'PB',
      }
    });
    a_city.save(function(err){
      should.not.exist(err);
      City.findOne({'ibge.id': '2512754'}, function(err, found) {
        should.not.exist(err);
        should.exist(found);
        found.ibge.id.should.equal('2512754');
        found.ibge.name.should.equal('Riachão do Bacamarte');
        found.ibge.lon.should.equal(-35.669257);
        found.ibge.lat.should.equal(-7.253472);
        found.ibge.uf.should.equal('PB');
        found.ibge.is_capital.should.equal(false);
      })
    })  
  })

  it('should load cities from ibge_cities.csv', function(){
    // city already in db, should be remove by the import
    City.reset(function(err) {
      should.not.exist(err);        
      City.count({}, function(err,count){
        should.not.exist(err);
        count.should.equal(5563);
      })
    })
  })
})