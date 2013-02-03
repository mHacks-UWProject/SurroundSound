var mongoose = require('mongoose');
var RAND_MAX = 5;

exports.getNextSong = function(loungeId){
	var Lounge = mongoose.model('Lounge');
	var lounge = Lounge.find({ _id: loungeId });
	
	// get random number
	var randNum = Math.floor(Math.random()*RAND_MAX);
	
	//if selecting requested item or not
	if(randNum == 0){
		var requested = lounge.requested;
		var nextSong = requested[0];
		var newRequested = [];
		
		for(var i = 0; i < requested.count()-1; i++) {
			newRequested[i] = requested[i+1]
		}
		
		lounge.requested = newRequested;
		lounge.save();
	} 
	else {
		
		
		
	}
}

