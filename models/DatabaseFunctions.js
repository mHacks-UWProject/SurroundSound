var mongoose = require('mongoose');
var request = require('request');

exports.importData = function (jsonArtists) {
	
	var getCorrection = "http://ws.audioscrobbler.com/2.0/?method=" +
			"artist.getcorrection&artist=";
	var getTopTracks = "http://ws.audioscrobbler.com/2.0/?method=" +
			"artist.gettoptracks&artist=";
	var getAPIKey = "&api_key=7f989465f20cc96c5bdc96f18dea2ad5&format=json";
	
	
	for(var artist in jsonArtists.d) {
		getCorrection += artist + getAPIKey;
		
		request(getCorrection, function (correctionError, correctionResponse, correctionBody) {
			if (!correctionError && correctionResponse.statusCode == 200) {
				
				var correctedName = correctionBody.corrections.correction.artist.name;
				
				if(!databaseContainsArtist(correctedName))
				{
					getTopTracks += correctedName + getAPIKey;
					
					request(getTopTracks, function (topTrackError, topTrackResponse, topTrackBody) {
						if (!topTrackError && topTrackResponse.statusCode == 200) {
							for(var track in topTrackBody.toptracks.track){
								//track.name
							}
						}
					});
				}
			}
		});
	}
}

exports.newLounge = function () {
	var Lounge = mongoose.model('Lounge')
}

exports.newUser = function(data) {
	var User = mongoose.model('UserModel')
	var user = new User({username: data.username, password: data.password, email: data.email});
	user.save();
}



function databaseContainsArtist(correctedName){
		return false;
	}
