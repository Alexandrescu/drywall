module.exports = function(io) {

	io.sockets.on('connection', function (socket) {
	
		socket.emit('news', {hello : 'hi'});
	
		//Debug purposes
		socket.on('pulse', function(data) {
		

		});
	


	});
};

