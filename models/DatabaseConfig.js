var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
	name: String,
	password: String,
	email: String
	});

var ArtistSchema = new mongoose.Schema({
	name: String,
	genre: String,
	topSongs: [String]
	});

var LoungeSchema = new mongoose.Schema({
	name: String,
	geolocation: {type: [Number], index:'2d'},
	user: [UserSchema],
	loungePassword: String,
	artists: [{ type: Schema.Types.ObjectId, ref: 'Artists' }]
	});

var UserModel = new mongoose.model('User', UserSchema);
var ArtistModel = new mongoose.model('Artist', ArtistSchema);
var LoungeModel = new mongoose.model('Lounge', LoungeSchema);
LoungeModel.ensureIndex({geolocation: "2d"})
	
