var mongoose = require('mongoose');
var RAND_MAX = 5;

exports.getNextSong = function(loungeId){
	var Lounge = mongoose.model('Lounge');
	Lounge.findById(loungeId, function(err, lounge) {
		var nextSong;
		
		// get random number
		var randNum = Math.floor(Math.random()*RAND_MAX);
		
		//if selecting requested item or not
		if(randNum == 0){
			nextSong = lounge.requested.shift();
		} else {
			// get non requested song based on algorithm
			var artists = lounge.artists;
			artists.sort(function(a,b) {
				if (a.count < b.count)
					return -1;
				if (a.count > b.count)
					return 1;
				return 0;
			});
			
			for(var i = 0; i < artists.length/2; i++){
				
			}
		}
		
	});
}
