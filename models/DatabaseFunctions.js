var mongoose = require('mongoose');
var request = require('request');

exports.importData = function (jsonArtists) {
	
	var getCorrection = "http://ws.audioscrobbler.com/2.0/?method=" +
			"artist.getcorrection&artist=";
	var getTopTracks = "http://ws.audioscrobbler.com/2.0/?method=" +
			"artist.gettoptracks&artist=";
	var getAPIKey = "&api_key=7f989465f20cc96c5bdc96f18dea2ad5&format=json"
	
	
	for(var artist in jsonArtists.d) {
		getCorrection += artist + getAPIKey;
		
		request(getCorrection, function (correctionError, correctionResponse, correctionBody) {
			if (!error && response.statusCode == 200) {
				
				var correctedName = correctionBody.corrections.correction.artist.name;
				
				if(!databaseContainsArtist(correctedName))
				{
					getTopTracks += correctedName + getAPIKey;
					
					request(getTopTracks, function (topTrackError, topTrackResponse, topTrackBody) {
						if (!error && response.statusCode == 200) {
							for(var track in topTrackBody.toptracks.track){
								track.name
							}
						}
					}
				}
			}
		}
	}
}

function databaseContainsArtist(correctedName){
	
	mongoose.
	
	}