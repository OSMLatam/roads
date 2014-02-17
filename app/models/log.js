/**
 * Module dependencies.
 */

var mongoose = require('mongoose'),
	env = process.env.NODE_ENV || 'development',
	config = require('../../config/config')[env],
	Schema = mongoose.Schema;
	
/**
 * Log Schema
 */

var LogSchema = new Schema({
	timestamp: {type: Date, default: Date.now},
	statuscode: Number,
	status: {type: String, enum: ['error', 'info'], default: 'info'},
	affectedCities: [{type: String, ref: 'City'}],
	data: {}
});

/**
 * Virtuals
 **/

LogSchema.virtual('message').get(function () {
  return ' the message';
});


/**
 * Statics
 */

LogSchema.statics = {
	list: function (options, cb) {
	  var criteria = options.criteria || {}
	  this.find(options.criteria)
			.sort({timestamp: -1})
	    .limit(options.perPage)
	    .skip(options.perPage * options.page)
	    .exec(cb)
	}
}

mongoose.model('Log', LogSchema);