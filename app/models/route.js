/**
 * Module dependencies.
 */

var 
	mongoose = require('mongoose'),
	env = process.env.NODE_ENV || 'development',
	config = require('../../config/config')[env],
	Schema = mongoose.Schema;
	
/**
 * Route Schema
 */

var RouteSchema = new Schema({
	from: {type: Schema.ObjectId, ref: 'City'},
	to: {type: Schema.ObjectId, ref: 'City'},
	updatedAt: {type: Date, default: Date.now},
	isUpdating: Boolean,
	straightDistance: Number,
	routeLength: Number,
	status: {type: String, enum: ['connected', 'missing', 'tortuous', 'unknown'], default: 'updating' },
	lastRequestStatus: {type: String, enum: ['connected', 'missing', 'tortuous', 'unknown'], default: 'updating' }
});