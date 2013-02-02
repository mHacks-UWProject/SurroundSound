var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
	name: String,
	password: String,
	email: String,
	lounge: LoungeSchema
	});
	
var ArtistSchema = mongoose.Schema({
	name: String,
	genre: [String],
	topSongs: [String],
	count: Number,
	likes: Number,
	dislikes: Number,
	request: Boolean
	});

var LoungeSchema = mongoose.Schema({
	name: String,
	geolocation: {type: [Number], index:'2d'},
	user: [UserSchema],
	queue: [String],
	loungePassword: String,
	artists: [ArtistSchema],
	requested: [{song:String, artist:String}]
	});


LoungeSchema.index({geolocation: "2d"});

mongoose.model('User', UserSchema);
mongoose.model('Artist', ArtistSchema);
mongoose.model('Lounge', LoungeSchema);
