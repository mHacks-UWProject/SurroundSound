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
	topSongs: [String],
	count: Number
	});

var LoungeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
	name: String,
	geolocation: {type: [Number], index:'2d'},
	user: [UserSchema],
	queue: ['string'],
	loungePassword: String,
	artists: [ArtistSchema],
	requested: [{song:String, artist:String}]
	});


LoungeSchema.index({geolocation: "2d"});

mongoose.model('User', UserSchema);
mongoose.model('Artist', ArtistSchema);
mongoose.model('Lounge', LoungeSchema);
