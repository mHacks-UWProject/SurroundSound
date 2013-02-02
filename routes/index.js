
/*
 * GET home page.
 */
 
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
	database.newUser(req.body);
};

exports.dj = function(req,res) {
	res.render('dj', { title: 'DJ' });
};

exports.postArtists = function(req, res){
	database.importData(req.body);
};
	
exports.getQueue = function(req, res){
	
};

exports.queryLounges = function(req, res) {
	var lounges = database.queryLounges(req.body.geo);
	res.send(lounges);
}
