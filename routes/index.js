
/*
 * GET home page.
 */
 
var database = require("../models/DatabaseFunctions.js")

exports.index = function(req, res){
  	res.render('index', { title: 'Express' });
};
exports.login = function(req, res) {
	res.send("login screen placeholder");
};
exports.dj = function(req,res) {
	res.send('dj screen placeholder');
}

exports.postArtists = function(req, res){
	database.importData(req.body);
};
	
exports.queue = function(req, res){
	
};
exports.index = function(req, res){
  res.render('dj', { title: 'DJ Stuff' });
};
