var mongoose = require('mongoose');
var request = require('request');

var ArtistModel = mongoose.model('Artist');
var Lounge = mongoose.model('Lounge');
var User = mongoose.model('User')

exports.importData = function (jsonArtists) {
	var getTopTracks = "http://ws.audioscrobbler.com/2.0/?method=" +
			"artist.gettoptracks&artist=";
	var getAPIKey = "&autocorrect=1&api_key=7f989465f20cc96c5bdc96f18dea2ad5&format=json";
	
	
	for(var artist in jsonArtists.d) {
		getCorrection += artist + getAPIKey;
		
		request(getTopTracks, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				
				var correctedName = body.toptracks.track[0].artist.name;
				var genre = [];
				var topTracks = [];
				
				for(var track in body.toptracks.track){
					topTracks.push(track.name);
				}
				
				// push to db
				var artist = new ArtistModel({
					name: correctedName,
					genre: genre,
					topSongs: topTracks
				});
				
				ArtistModel.update({ name: artist.name}, 
					{name: artist.name, genre: artist.genre, topSoungs: artis.topSongs}, 
					{upsert: true});
					
				updateArtistCounter(artist.name, 1);
				
			}
		});
	}
}

exports.newLounge = function (user) {
	var lounge = new Lounge({user: user.id, geolocation: [42.280681,-83.733818], active: true});
	lounge.save();
	return lounge;
}

exports.newUser = function(data) {
	var user = new User({username: data.username, password: data.password, email: data.email});
	user.save();
	return user;
}
exports.getLounge = function(id) {
	lounge = Lounge.findById(id, function(err, lounge) {
		return lounge;
	});
}

exports.queryLounges = function(location) {
	var actives = [];
	Lounge.find({geolocation: {$near: location, $maxDistance: 10}}, function(err, lounges){ 
		for (var i =0; i < lounges.length; i++) {
			User.findById(lounges[i].user.id, function(err, user) {
				if (lounges[i].user.active)
					actives.push(lounges[i])
				if (i == lounges.length - 1)
					return actives;
			})
		}
	});
}

exports.queryLoungeInformation = function(loungeId){
	var Lounge = mongoose.model('Lounge');
	Lounge.findById(loungeId, function(err, lounge){ 
		return lounge;
	});
}

exports.likeArtist = function(artist) {
	updateArtistCounter(artist, 1);
}

exports.dislikeArtist = function(artist) {
	updateArtistCounter(artist, -1);
}

function updateArtistCounter (artist, increment){
	ArtistModel.findAndModify({ name: artist }, [], { $inc: { counter: increment } });
}

exports.recommendSong = function(songJson) {
		
	
}
