var mongoose = require('mongoose');

var UserSchema = new new mongoose.Schema({
	name: String,
	password: String,
	email: String
	});

var ArtistSchema = new new mongoose.Schema({
	name: String,
	genre: String,
	topSongs: [String]
	});

var LoungeSchema = new mongoose.Schema({
	name: String,
	geolocation: String,
	user: [UserSchema],
	loungePassword: String,
	artists: [{ type: Schema.Types.ObjectId, ref: 'Artists' }]
	});
	
var User = new mongoose.model('UserModel', UserSchema);
var Artist = new mongoose.model('ArtistModel', ArtistSchema);
var Lounge = new mongoose.model('LoungeModel', LoungeSchema);