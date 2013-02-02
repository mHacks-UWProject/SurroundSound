
/*
 * GET home page.
 */

var databaseConfig = require("../models/DatabaseConfig.js") 
var database = require("../models/DatabaseFunctions.js")

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
	var user = database.newUser({username: req.body.username, password: req.body.password, email: req.body.email});
	database.newLounge(user);
	req.login(user, function(err) {
		if (err) return next(err); 
		return res.redirect('/createLounge');
	});
};


exports.dj = function(req,res) {
	var User = mongoose.model("User");
	var user = User.update({name: req.user.name}, {active: true});
	res.render('dj', { title: 'DJ' });
};

exports.postArtists = function(req, res){
	database.importData(req.body);
};

exports.newLounge = function(req, res){
  res.render('new_lounge', { title: 'Create your Sound Lounge'});
};

exports.createLounge = function(req, res){
	// do some data checks
  // save data
  // redirect to /dj
};

exports.getLounge = function(req, res){
	
};

exports.queryLounges = function(req, res) {
	var lounges = database.queryLounges(req.body.geo);
	res.send(lounges);
}
