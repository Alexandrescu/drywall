function startAPI(app, mongoose, passport) {

	var io = require ('socket.io').listen(app.server);

	//Degut view
	app.get('/debug', function (req, res) {
  		res.sendfile(__dirname + '/debug.html');
	});


/*
	//Creating post handler for login
	api.post('/login', events.login);

	//Loding the events
	events = require('./events');

	//events for this socket and mongoose instance
	events(io, mongoose);
*/

}

module.exports.startAPI = startAPI;