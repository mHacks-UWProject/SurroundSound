var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
	name: String,
	password: String,
	email: String,
	lounge: [LoungeSchema]
	});
	
var ArtistSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
	name: String,
	genre: [String],
	topSongs: [String]
	});

var LoungeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
	name: String,
	geolocation: {type: [Number], index:'2d'},
	user: [UserSchema],
	loungePassword: String,
	artists: [ArtistSchema],
	artists: [UserSchema]
	});


LoungeSchema.index({geolocation: "2d"});

mongoose.model('User', UserSchema);
mongoose.model('Artist', ArtistSchema);
mongoose.model('Lounge', LoungeSchema);
