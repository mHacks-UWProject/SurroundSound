var mongoose = require('mongoose');
var RAND_MAX = 5;

exports.getNextSong = function(loungeId){
	var Lounge = mongoose.model('Lounge');
	Lounge.findById(loungeId, function(err, lounge) {
		if(!err && lounge != undefined){
			var nextSong;
			
			// get random number
			var randNum = Math.floor(Math.random()*RAND_MAX);
			
			//if selecting requested item or not
			if(randNum == 0 && lounge.requested.length > 0 ){
				nextSong = lounge.requested.shift();
			} else {
				// get non requested song based on algorithm

				if(lounge.artists != undefined){
					var artists = lounge.artists;
					var artistScore = [];
					for(var i = 0; i < artists.length; i++){
						var artist = artists[i]
						artistScore.push(artist.count + artist.likes - artist.dislikes)
					}
					var highest = 0;
					var highestindex = 0;
					for (var i = 0; i < artistScore.length; i ++ ) {
						if (artistScore[i] > highest){
							highest = artistScore[i];
							highestindex = i;
						}
					}
					var highArtist = lounge.artists[highest]
					nextSong = {artist: highArtist, song: lounge.artists[highest].topSongs[Math.random() * lounge.artists[highest].length], albumImage: lounge.artists[highest].albumImage};
				}
			}
		}
		
	});
}
