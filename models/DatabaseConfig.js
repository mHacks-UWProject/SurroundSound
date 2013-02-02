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
	geolocation: {type: [Number], index:'2d'},
	user: [UserSchema],
	loungePassword: String,
	artists: [{ type: Schema.Types.ObjectId, ref: 'Artists' }]
	});
LoungeSchema.ensureIndex({geolocation: "2d"})
var UserModel = new mongoose.model('User', UserSchema);
var ArtistModel = new mongoose.model('Artist', ArtistSchema);
var LoungeModel = new mongoose.model('Lounge', LoungeSchema);