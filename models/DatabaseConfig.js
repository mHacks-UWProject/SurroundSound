var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId

	
var LoungeSchema = mongoose.Schema({
	name: String,
	geolocation: {type: [Number], index:'2d'},
	queue: [String],
	loungePassword: String,
	requested: [{song:String, artist:String, img:String}],
	artists: [{ name: String,
				albumImage: String,
				topSongs: [String],
				count: Number,
				likes: Number,
				dislikes: Number}],
	queue:[{song: String, artist: String, img: String}],
	user: ObjectId,
	active: Boolean,
	devIds: [{genId: String, regId: String}]
	});

var UserSchema = mongoose.Schema({
	username: String,
	password: String,
	email: String,
	lounge: ObjectId,
	active: Boolean
	});

var DeviceSchema = mongoose.Schema({
	genId: String,
	regId: String
});

LoungeSchema.index({geolocation: "2d"});

mongoose.model('User', UserSchema);
mongoose.model('Lounge', LoungeSchema);
mongoose.model('Device', DeviceSchema);
