function startAPI(app, mongoose, passport) {

	var io = require ('socket.io').listen(app.server);

	//Loding the events
	events = require('./events');

	//events for this socket and mongoose instance
	events(io, mongoose);

	app.post('/api/login/', events.login);
}

module.exports.startAPI = startAPI;