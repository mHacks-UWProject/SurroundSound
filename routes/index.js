
/*
 * GET home page.
 */

var databaseConfig = require("../models/DatabaseConfig.js") 
var database = require("../models/DatabaseFunctions.js")
var mongoose = require('mongoose')
var Lounge = mongoose.model("Lounge")
var User = mongoose.model("User");

exports.index = function(req, res){
  res.render('dj', { title: 'DJ Stuff' });
};

exports.login = function(req, res) {
  res.render('login', { title: 'Login' });
};

exports.register = function(req, res) {
  res.render('register', { title: 'Register' });
};

exports.createUser = function(req, res) {
	if (req.body.password == req.body.confirmpassword) {
		var user = database.newUser({username: req.body.username, password: req.body.password, email: req.body.email});
		database.newLounge(user);
		req.login(user, function(err) {
			if (err) return next(err); 
			return res.redirect('/createLounge');
		});
	} else {
		res.send(400);
	}
	
};


exports.dj = function(req,res) {
	var User = mongoose.model("User");
	var user = User.update({name: req.user.name}, {active: true});
	Lounge.update({user: user.id}, {active: true});
	res.render('dj', { title: 'DJ' });
};

exports.postArtists = function(req, res){
	console.log(req.body);
	database.importData(req.body.artists, req.body.id);
	res.send("success");
};

exports.newLounge = function(req, res){
  res.render('new_lounge', { title: 'Create your Sound Lounge'});
};

exports.createLounge = function(req, res){
	User.find({name: req.user.name}, function(err, user) {
		database.newLounge({user: req.user.id, name: req.body.name, geolocation: req.body.geolocation, loungePassword: req.body.password});
		res.redirect("/dj");
	});
};
exports.updateLounge = function(req, res) {
	Lounge.update({user: req.user.id}, req.body);
}
exports.getLounge = function(req, res){	
	 Lounge.findById(req.body.id, function(err, lounge) {
	 	res.send(lounge);
	 });
};

exports.queryLounges = function(req, res) {
	var lounges = database.queryLounges(req.body.geo, res);
	console.log('lounges', lounges)
	//res.send(lounges);\ \\
}

exports.requestSong = function(req, res) {
	Lounge.findById(req.body.id, function(err, lounge) {
		lounge.requested.push([req.body.song, req.body.artist]);
		res.send("success");
	})
}

exports.registerGCM = function(req, res) {
	var deviceModel = mongoose.model('Device');
	if (req.body['genId'] != "") {
		deviceModel.update({devId: req.body['genId']}, {regId: req.body['regId']});
		gcmHelpers.sendId(+
			req.body['genId'], [req.body['regId']]);
	} else {
		var newId = randomstring.generate();
		var newDevice = new deviceModel({devId: newId, regId: req.body['regId'], stock: ""});
		newDevice.save();
		gcmHelpers.sendId(newId, [req.body['regId']]);
	}
	//if (typeof res.body != 'undefined' && res.body){
	//}
		
	res.send('sup');
}

exports.testYoutube = function(req, res){
	res.send([{artist: "Mumford and Sons", song: "Cave", img: ""}, {artist: "Madeon", song:"Finale", img: ""}, {artist: "Decemberists", 
		song: "We Both Go Down Together", img: ""}, {artist: "The Protomen", song: "The Hounds", img: ""}, {artist: "Muse", song: "Knights of Cydonia", img: ""}]);
};