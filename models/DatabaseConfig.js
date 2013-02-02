var mongoose = require('mongoose');

var UserSchema = new new mongoose.Schema({
    _id: Schema.Types.ObjectId,
	name: String,
	password: String,
	email: String
	});

var ArtistSchema = new new mongoose.Schema({
    _id: Schema.Types.ObjectId,
	name: String,
	genre: String,
	topSongs: [String]
	});

var LoungeSchema = new mongoose.Schema({
    _id: Schema.Types.ObjectId,
	name: String,
	geolocation: String,
	user: [UserSchema],
	loungePassword: String,
	artists: [{ type: Schema.Types.ObjectId, ref: 'Artists' }]
	});
	
var User = new mongoose.model('User', UserSchema);
var Artist = new mongoose.model('Artist', ArtistSchema);
var Lounge = new mongoose.model('Lounge', LoungeSchema);