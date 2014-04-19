function debug() {
	var http = require('http'),	fs = require('fs');

	function theServer(request, response) {
		fs.readFile("./api/debug.html", 'utf-8', function (error, data) {
	        response.writeHead(200, {'Content-Type': 'text/html'});
	        response.write(data);
	        response.end();
	    });
	}
	var returnValue = http.createServer(theServer).listen(1337);
	return returnValue;
}

function startAPI() {
	var debugServer = debug();
	var io = require ('socket.io').listen(debugServer);

	require('./events')(io);
}

module.exports.startAPI = startAPI;