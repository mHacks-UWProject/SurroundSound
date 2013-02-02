var mongoose = require('mongoose');
var RAND_MAX = 5;

exports.getNextSong(){
	// get random number
	var randNum = Math.floor(Math.random()*RAND_MAX);
	
	//if selecting requested item or not
	if(randNum == 0){
		
		
		
		
	} 
	else {
		
		
	}
	
	
	
	
}



exports.newUser(loungeId, clientId){
	
	
}

exports.newLike(loungeId, clientId){
	handleRequest(loungeId, clientId);
}

exports.newDislike(loungeId, clientId){
	handleRequest(loungeId, clientId);
}

function handleFeedback(loungeId, clientId){
	
	
}

exports.newRequest(loungeId, clientId, request){
	
	var Lounge = mongoose.model('Lounge');
	Lounge.find({_id: loungeId}}, function(err, lounge){ 
		lounge.find({}, function()){
			
			
			
			
				
		});
	});
}
