var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId

var QueueSchema = mongoose.Schema({
	artist: String,
	track: String,
	position: Number
	});
	
var LoungeSchema = mongoose.Schema({
	name: String,
	geolocation: {type: [Number], index:'2d'},
	queue: [String],
	loungePassword: String,
	requested: [{song:String, artist:String}],
	artists: [{ name: String,
				topSongs: [String],
				count: Number,
				likes: Number,
				dislikes: Number}],
	user: ObjectId,
	active: Boolean
	});

var UserSchema = mongoose.Schema({
	username: String,
	password: String,
	email: String,
	lounge: ObjectId,
	active: Boolean
	});

var DeviceSchema = mongoose.Schema({
	webid: Number,
	regid: Number,
})

LoungeSchema.index({geolocation: "2d"});

mongoose.model('User', UserSchema);
mongoose.model('Lounge', LoungeSchema);
mongoose.model('Queue', QueueSchema);
mongoose.model('Device', DeviceSchema);
