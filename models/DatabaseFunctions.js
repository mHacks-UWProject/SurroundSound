var mongoose = require('mongoose');
var request = require('request');
var musicAlgorithm = require('../models/MusicAlgorithm.js');

var Lounge = mongoose.model('Lounge');
var User = mongoose.model('User')

var MAX_QUEUE_ITEMS = 5;

exports.importData = function (jsonArtists, loungeId) {
	var getTopTracks = "http://ws.audioscrobbler.com/2.0/?method=" +
			"artist.gettoptracks&artist=";
	var getAPIKey = "&autocorrect=1&api_key=7f989465f20cc96c5bdc96f18dea2ad5&format=json";
	
	var lounge = Lounge.find({_id: loungeId});
	var loungeArtists = lounge.artists;
				
	for(var artist in jsonArtists.d) {
		var artistExists = false;
		
		getCorrection += artist + getAPIKey;
		request(getTopTracks, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				var correctedName = body.toptracks.track[0].artist.name;

				for(var loungeArtist in loungeArtists){
					if(loungeArtist.name == correctedName){
						updateArtistCounter(artist.name, 1);
						continue;
					}
				}
				
				var topTracks = [];
				
				for(var track in body.toptracks.track){
					topTracks.push(track.name);
				}
					
				lounge.artist.push({
					name: correctedName,
					topSongs: topTracks,
					count: 1,
					likes: 0,
					dislikes: 0
				});
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

exports.queryLounges = function(location, res) {
	var actives = [];
	Lounge.find({geolocation: {$near: location, $maxDistance: 10}}, function(err, lounges){ 
		console.log("lounges log", lounges);
		if (err){
			console.log(err);
			res.send("NONE FOUND");
		} else {
			for (var i = 0; i < lounges.length; i++) {
				//if (lounges.active)
				var lounge = lounges[i];
				lounge.nowPlaying = lounges[i].queue[0];
				actives.push(lounges);
			};
			res.send(actives);
		};
	});
}

exports.queryLoungeInformation = function(loungeId){
	var Lounge = mongoose.model('Lounge');
	Lounge.findById(loungeId, function(err, lounge){ 
		return lounge;
	});
}

exports.likeArtist = function(loungeId, artist) {
	updateArtistCounter(artist, 1);
}

exports.dislikeArtist = function(loungeId, artist) {
	updateArtistCounter(artist, -1);
}

function updateArtistCounter (loungeId, artist, increment){
	var lounge = Lounge.find({ _id: loungeId });
	var artists = lounge.artists;
	for(var i = 0; i < artists.count(); i++) {
		if(artists[i].name == artist){
			lounge.artists[i].count += increment;
			lounge.save();
			return;
		}
	}
}

exports.recommendSong = function(songJson, loungeId) {
	var lounge = Lounge.find({ _id: loungeId });
	var requested = lounge.requested;
	
	for(var i = 0; i < requested.count(); i++) {
		if(requested[i].name == songJson.artist){
			return;
		}
	}
	
	requested.push({song: songJson.track, artist: songJson.artist});
}

exports.popAndUpdateQueue = function(id){
	var nextSong = musicAlgorithm.getNextSong();
	var queueResults;
	
	Lounge.findById(id, function(err, lounge){
		lounge.queue.slice(1).push({artist: nextSong.artist, song: nextSong.track, img: ""});
	});

	/*if(queueResults.count() == 0) {
		for(var i = 0; i < MAX_QUEUE_ITEMS; i++) {
			var queueItem = new Queue({ artist: nextSong.artist, track: nextSong.track, position: i });
			queueItem.save();
		}
	}
	else {
		for(var i = 0; i < MAX_QUEUE_ITEMS; i++) {
			if(queueResults[i].position == 0) {
				queueResults[i].remove();
			}
			else {
				queueResults[i].position -= 1;
			}
		}
		var queueItem = new Queue({ artist: nextSong.artist, track: nextSong.track, position: (MAX_QUEUE_ITEMS-1) });
		queueItem.save();
	}*/	
	
}
