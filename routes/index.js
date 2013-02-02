
/*
 * GET home page.
 */
 
var database = require("../models/DatabaseFunctions.js")

exports.index = function(req, res){
	res.render('index', { title: 'Express' });
	};

exports.postArtists = function(req, res){
	database.importData(req.body);
	};
	
exports.Queue = function(req, res){
	
	};