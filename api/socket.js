function startAPI(app, mongoose, passport) {

	var io = require ('socket.io').listen(app.server);

	//Loding the events
	events = require('./socketEvents');

	//events for this socket and mongoose instance
	events(io, mongoose, app);
}

module.exports.startAPI = startAPI;