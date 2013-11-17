/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema
  , csv = require('csv')

/**
 * City Schema
 */

var CitySchema = new Schema({
  ibge_id: {type : String, default : '', trim : true},
  name: {type : String, default : '', trim : true, required: true},
  uf: {type: String},  
  isCapital: {type: Boolean, defaut: false},
  loc: { type: {type: String}, coordinates: []}
})

CitySchema.index({ loc: '2dsphere' })

/**
 * Statics
 */

CitySchema.statics = {

  load: function (id, doneLoading) {
    this.findOne({ _id : id })
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