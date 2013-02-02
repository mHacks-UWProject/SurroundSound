var mongoose = require('mongoose');

var UserSchema = mongoose.Schema({
	name: 'string',
	password: 'string',
	email: 'string'
	});

var ArtistSchema = mongoose.Schema({
	name: 'string',
	genre: 'string',
	topSongs: ['string']
	});

var LoungeSchema = mongoose.Schema({
	name: 'string',
	geolocation: {type: ['number'], index:'2d'},
	user: [UserSchema],
	loungePassword: 'string',
	artists: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Artists' }]
	});

LoungeSchema.index({geolocation: "2d"});

var UserModel = mongoose.model('User', UserSchema);
var ArtistModel = mongoose.model('Artist', ArtistSchema);
var LoungeModel = mongoose.model('Lounge', LoungeSchema);
