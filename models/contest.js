const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contestSchema = new Schema(
{
	id: {
		type: Number,
		required: true,
	},
	name: {
		type: String,
		required: true
	},
	kind: {
		type: String,
		enum: ["Training Contest", "Official ICPC Contest", "Official School Contest",
		"School/University/City/Region Championship", "Training Camp Contest",
		"Official International Personal Contest" , "Opencup Contest"],
		required: true,
	},
	season: {
		type: String,
		required: true,
	}
},
{
	toJSON: {
		transform: function (doc, ret) {
			delete ret.__v;
		},
	},
});

module.exports = mongoose.model('Contest', contestSchema);
