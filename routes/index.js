
/*
 * GET home page.
 */

exports.index = function(req, res){
  	res.render('index', { title: 'Express' });
};
exports.login = function(req, res) {
	res.send("login screen placeholder");
};
exports.dj = function(req,res) {
	res.send('dj screen placeholder');
}