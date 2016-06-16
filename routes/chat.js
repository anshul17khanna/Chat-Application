// Server-Side

function clientRoom(io,roomId,namespace) {
	var res = [],
		ns = io.of(namespace || "/");

	if(ns){
		for(var id in ns.connected){
			if(roomId){
				var index = ns.connected[id].rooms.indexOf(roomId) ;
				if(index !== -1) {
					res.push(ns.connected[id]);
				}
			}else {
				res.push(ns.connected[id]);
			}
		}
	}
	return res;
}

module.exports = function(app, io){

  var id = Math.round((Math.random()*1000000));

  app.get('/create', function(request, response){
	response.redirect('/chat/'+id);
  });

  app.get('/chat/'+id, function(request, response){
	response.render('chat');
  });

  var chat = io.on('connection', function (socket){
    socket.on('load', function(data){
      var room = clientRoom(io, data);

      if(room.length === 0){
        socket.emit('totalchatpeople', {count: 0});
	  }else{
		socket.emit('totalchatpeople', {
			count: room.length,
			user: room[0].username,
			id: data
		});
	  }
    });

    socket.on('login', function(data){
      var room = clientRoom(io, data.id);

      socket.username = data.user;
	  socket.room = data.id;

      socket.join(data.id);

      if (room.length > 0) {
		var usernames = [];

		usernames.push(room[0].username);
		usernames.push(socket.username);

		chat.in(data.id).emit('startChat', {
			boolean: true,
			id: data.id,
			users: usernames,
		});
	  }
    });

    socket.on('disconnect', function(){
	    socket.broadcast.to(this.room).emit('leave', {
			boolean: true,
			room: this.room,
			user: this.username
		});

		socket.leave(socket.room);
	});

    socket.on('msg', function(data){
		socket.broadcast.to(socket.room).emit('receive', {msg: data.msg, user: data.user});
	});
  });
}
