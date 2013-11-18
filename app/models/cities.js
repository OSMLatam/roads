/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , csv = require('csv')
  , _ = require('underscore')

/**
 * City Schema
 */

var CitySchema = new Schema({
  ibge_id: {type : String, default : '', trim : true},
  name: {type : String, default : '', trim : true, required: true},
  uf: {type: String},  
  isCapital: {type: Boolean, defaut: false},
  connections: [{
    to: { type: Schema.ObjectId, ref: 'City'},
    straightDistance: {type: Number, default: 0},
    routeForwardDistanceRatio: {type: Number, default: 0},
    routeBackwardDistanceRatio: {type: Number, default: 0}
  }],
  loc: { type: {type: String}, coordinates: []}
})

CitySchema.index({ loc: '2dsphere' })

/**
 * Methods
 */

CitySchema.methods = {
  getLon: function(){
    return this.loc.coordinates[0]
  },
  getLat: function(){
    return this.loc.coordinates[1]    
  },
  findNearest: function(count, callback) {
    this.model('City')
      .find({ loc: { $near: { type: 'Point', coordinates:[this.getLon(), this.getLat()] }}})
      .limit(count)
      .skip(1)
      .exec(function(err, cities){
        if (err) callback(err)
        callback(err, cities)
    })
  },
  updateConnections: function(){
    var self = this
    self.findNearest(5, function(err,nearCities){
      self.connections = []
      _.each(nearCities, function(nearCity){
        self.connections.push({
          to: nearCity,
          straightDistance: 1.5,
          routeForwardDistanceRatio: 2,
          routeBackwardDistanceRatio: 3
        })
      })
      self.save()
    })
  },
  fullName: function(){
    return this.name + ' (' + this.uf + ')'
  }
}

/**
 * Statics
 */

CitySchema.statics = {

  load: function (id, doneLoading) {
    this
      .findOne({ _id : id })
      .exec(doneLoading)      
  },
  list: function (options, cb) {
    var criteria = options.criteria || {}
    this.find(criteria)
      .sort(options.sortBy || {'name': 1})
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  },
  importFromCSV: function(filename, callback) {
    var self = this
    csv()
    .from.path(__dirname+filename, { columns: true, delimiter: ',', escape: '"' })
    .on('record', function(row, index){

      attributes = {
        name: row.name,
        ibge_id: row.ibge_id,
        uf: row.uf,
        isCapital: row.capital,
        loc: {type: 'Point', coordinates: [new Number(row.lon),new Number(row.lat)]}
      }

      self.update({ibge_id: row.ibge_id},{$set: attributes},{upsert: true})
    })
    .on('end', function(count){
      callback()
    })
    .on('error', function(err){
      callback(err)
    })
  }
}


mongoose.model('City', CitySchema)