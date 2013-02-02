var mongoose = require('mongoose');
var request = require('request');
var ArtistModel = mongoose.model('Artist');

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
				
				ArtistModel.update({ _id: artist.id}, 
					{name: artist.name, genre: artist.genre, topSoungs: artis.topSongs}, 
					{upsert: true});
				
			}
		});
	}
}

exports.newLounge = function () {
	var Lounge = mongoose.model('Lounge');
}

exports.newUser = function(data) {
	var User = mongoose.model('User')
	var user = new User({username: data.username, password: data.password, email: data.email});
	user.save();
}

function queryLounges(location) {
	var Lounge = mongoose.model('Lounge');
	Lounge.find({geolocation: {$near: location, $maxDistance: 10}}, function(err, lounges){ 
		return lounges;
	});
}

function queryLoungeInformation(loungeId){
	var Lounge = mongoose.model('Lounge');
	Lounge.find({_id: loungeId}, function(err, lounge){ 
		return lounge;
	});
}

function likeArtist(artist) {
	updateArtistCounter(artist, 1);
}

function dislikeArtist(artist) {
	updateArtistCounter(artist, -1);
}

function updateArtistCounter(artist, increment){
	ArtistModel.findAndModify({ name: artist }, [], { $inc: { counter: increment } });

}
	