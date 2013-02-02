var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId

var QueueSchema = mongoose.Schema({
	artist: [ArtistSchema],
	track: String,
	position: Number
	});
	
var ArtistSchema = mongoose.Schema({
	name: String,
	genre: [String],
	topSongs: [String],
	count: Number,
	likes: Number,
	dislikes: Number,
	request: Boolean,
	});

var LoungeSchema = mongoose.Schema({
	name: String,
	geolocation: {type: [Number], index:'2d'},
	queue: [String],
	loungePassword: String,
	artists: [ObjectId],
	requested: [{song:String, artist:String}],
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
mongoose.model('Artist', ArtistSchema);
mongoose.model('Lounge', LoungeSchema);
mongoose.model('Queue', QueueSchema);
mongoose.model('Device', DeviceSchema);
