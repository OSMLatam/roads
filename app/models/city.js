
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , csv      = require('csv')
  // , Imager = require('imager')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  // , imagerConfig = require(config.root + '/config/imager.js')
  , Schema = mongoose.Schema

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',')
}

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',')
}

/**
 * Article Schema
 */

var CitySchema = new Schema({
  ibge: {
    id: {type: String},
    lon: {type: Number},
    lat: {type: Number},
    uf: {type : String, default : '', trim : true},
    name: {type : String, default : '', trim : true},
    is_capital: {type: Boolean, default: false}
  },
  osm: {
    id: {type: String},
    lon: {type: Number},
    lat: {type: Number},
    tags: {
      k: String,
      v: String
    }
  }
})

/**
 * Validations
 */

// CitySchema.path('title').validate(function (title) {
//   return title.length > 0
// }, 'Article title cannot be blank')
// 
// ArticleSchema.path('body').validate(function (body) {
//   return body.length > 0
// }, 'Article body cannot be blank')

/**
 * Pre-remove hook
 */

// CitySchema.pre('remove', function (next) {
//   var imager = new Imager(imagerConfig, 'S3')
//   var files = this.image.files
// 
//   // if there are files associated with the item, remove from the cloud too
//   imager.remove(files, function (err) {
//     if (err) return next(err)
//   }, 'article')
// 
//   next()
// })

/**
 * Methods
 */

// ArticleSchema.methods = {

  /**
   * Save article and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  // uploadAndSave: function (images, cb) {
  //   if (!images || !images.length) return this.save(cb)
  // 
  //   var imager = new Imager(imagerConfig, 'S3')
  //   var self = this
  // 
  //   imager.upload(images, function (err, cdnUri, files) {
  //     if (err) return cb(err)
  //     if (files.length) {
  //       self.image = { cdnUri : cdnUri, files : files }
  //     }
  //     self.save(cb)
  //   }, 'article')
  // },

  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */

  // addComment: function (user, comment, cb) {
  //   var notify = require('../mailer/notify')
  // 
  //   this.comments.push({
  //     body: comment.body,
  //     user: user._id
  //   })
  // 
  //   notify.comment({
  //     article: this,
  //     currentUser: user,
  //     comment: comment.body
  //   })
  // 
  //   this.save(cb)
  // }

// }

/**
 * Statics
 */

CitySchema.statics = {
  refresh: function (json,cb) {
    console.log(json);
  }
} 


CitySchema.statics = {

  /**
   * Find city by id
   *
   * @param {String} filename
   * @param {Function} cb
   * @api private
   */
  reset: function(done) {
    // remove all
    csv()
      .from.path(__dirname+'/../../data/ibge_cities.csv', { columns: true, delimiter: ',', escape: '"' })
      .on('record', function(row,index){
        mongoose.model('City', CitySchema)({
            ibge: {
              id:         row.id,
              uf:         row.uf,
              name:       row.name,
              lat:        row.lat,
              lon:        row.lon,
              is_capital: row.is_capital
            }          
        }).save();
      })
      .on('end', function(){
        done();
      })
      .on('error', function(error){
        done(error);
      });
  },

  load: function (filename, cb) {
    this.findOne({ _id : id })
      // .populate('user', 'name email username')
      // .populate('comments.user') 
      .exec(cb)
  },

  /**
   * List articles
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      // .populate('user', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('City', CitySchema)