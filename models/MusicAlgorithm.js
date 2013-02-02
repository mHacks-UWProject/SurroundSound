var mongoose = require('mongoose');
var RAND_MAX = 5;

exports.getNextSong = function(){
	// get random number
	var randNum = Math.floor(Math.random()*RAND_MAX);
	
	//if selecting requested item or not
	if(randNum == 0){
		
		var Lounge = mongoose.model('Lounge');
		var requestedItem = Lounge.findOne({ request: true });
		
		
		
	} 
	else {
		
		
	}
	
	
	
	
}



exports.newUser = function(loungeId, clientId){
	
	
}

exports.newLike = function(loungeId, clientId){
	handleRequest(loungeId, clientId);
}

exports.newDislike = function(loungeId, clientId){
	handleRequest(loungeId, clientId);
}

function handleFeedback(loungeId, clientId){
	
	
}

exports.newRequest = function(loungeId, clientId, request){
	
	var Lounge = mongoose.model('Lounge');
	Lounge.find({_id: loungeId}, function(err, lounge){ 
		lounge.find({}, function(){
			
			
			
			
				
		});
	});
}
