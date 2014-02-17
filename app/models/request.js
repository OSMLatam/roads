/**
 * Module dependencies.
 */

var 
	mongoose = require('mongoose'),
	env = process.env.NODE_ENV || 'development',
	config = require('../../config/config')[env],
	Schema = mongoose.Schema;
	
/**
  * Request model
  */

var RequestSchema = new Schema({
	generatedAt: {type: Date, default: Date.now},
	startedAt: Date,
	finishedAt: Date,
	finished: {type: Boolean, default: false},
	from: { type: String, ref: 'City'},
	to: { type: String, ref: 'City'},
	statusCode: Number,
	data: {}
});

mongoose.model('Request', RequestSchema)