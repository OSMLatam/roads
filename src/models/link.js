var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var LinkSchema = new Schema({
	A: { type: Schema.ObjectId, ref: 'City'},
	B: { type: Schema.ObjectId, ref: 'City'},
	distance: {type: Number, default: 0},
	tortuosityAB: {type: Number, default: 0},
	tortuosityBA: {type: Number, default: 0},
	status: {type: String, enum: ['connected', 'tortuous', 'broken']},
	updatedAt: { type: Date, default: Date.now}
});

LinkSchema.statics = {
	findBetween: function(city1, city2, done) {
		this.findOne({$or: [{from: city1, to: city2}, {from: city1, to: city2}]}, done);
	}
}


mongoose.model('Link', LinkSchema)
