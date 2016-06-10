// Client-Side

function _init(){
  var section = $(".section"),
		  chatLogin = $(".chatLogin"),
		  member = $(".member"),
		  loginForm = $(".loginForm"),
		  ownerNickName = $("#ownerNickName"),
		  otherNickName = $("#otherNickName");

  var socket = io(),
      id = Number(window.location.href.split('/')[4]);
  // alert(id);

  socket.on('connect', function(){
    socket.emit('load', id);
	});
}

window.onload = _init;
