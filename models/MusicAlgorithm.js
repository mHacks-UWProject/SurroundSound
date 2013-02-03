var mongoose = require('mongoose');
var RAND_MAX = 5;

exports.getNextSong = function(){
	// get random number
	var randNum = Math.floor(Math.random()*RAND_MAX);
	
	//if selecting requested item or not
	if(randNum == 0){
		/*
		var Artist = mongoose.model('Artist');
		Lounge.findOneAndUpdate({ request: true }, function (err, lounge) {
			if (!err) {
				doc.request = false;
				doc.save(callback);
				return doc;
			}
		});*/
	} 
	else {
		
		
		
	}
}

