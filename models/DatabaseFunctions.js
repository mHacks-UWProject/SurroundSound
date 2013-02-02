var mongoose = require('mongoose');

exports.importData = function (jsonArtists) {
	
	var getCorrection = "http://ws.audioscrobbler.com/2.0/?method=" +
			"artist.getcorrection&artist=";
	var getCorrectionEnd = "&api_key=7f989465f20cc96c5bdc96f18dea2ad5&format=json"
			
	for(var artist in jsonArtists.d) {
		getCorrection += artist + getCorrectionEnd;
		
	}
	};

exports.newLounge = function () {
	var Lounge = mongoose.model('Lounge')
}
exports.newUser = function(data) {
	var User = mongoose.model('UserModel')
	var user = new User({username: data.username, password: data.password, email: data.email});
	user.save();
}