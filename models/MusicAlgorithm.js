var mongoose = require('mongoose');
var RAND_MAX = 5;

exports.getNextSong = function(loungeId){
	var Lounge = mongoose.model('Lounge');
	var lounge = Lounge.find({ _id: loungeId });
	var nextSong;
	
	// get random number
	var randNum = Math.floor(Math.random()*RAND_MAX);
	
	//if selecting requested item or not
	if(randNum == 0){
		var requested = lounge.requested;
		
		if(typeof requested != 'undefined' && requested.length() != 0){
			var newRequested = [];
			
			nextSong = requested[0];
			
			for(var i = 0; i < requested.count()-1; i++) {
				newRequested[i] = requested[i+1]
			}
			
			lounge.requested = newRequested;
			lounge.save();
		}
	} 
	
	// get non requested song based on algorithm
	
	var artists = lounge.artists;
	artists.sort(function(a,b) {
		if (a.count < b.count)
			return -1;
		if (a.count > b.count)
			return 1;
		return 0;
	});
	
	for(var i = 0; i < artists.count()/2; i++){
		
		
		
		
	}
	
	
	
}


function compare(a,b) {
  if (a.last_nom < b.last_nom)
     return -1;
  if (a.last_nom > b.last_nom)
    return 1;
  return 0;
}


