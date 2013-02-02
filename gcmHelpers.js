var gcm = require('node-gcm');

var sender = new gcm.Sender('AIzaSyBcWzjYG9RwCKIRXNcAWJvFL0wzzP7-uHY');
var registrationIds = [];

exports.sendChanged = function(ids) {
	var message = new gcm.Message();
	message.addData('message', 'update');
	sender.send(message, ids, 4, function(err, result) {
		console.log(result);
	})
};

