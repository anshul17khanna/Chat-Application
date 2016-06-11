// Client-Side

function _init(){
  var section = $(".section"),
		  chatLogin = $(".chatLogin"),
		  member = $(".member"),
		  loginForm = $(".loginForm"),
		  selfNickName = $("#selfNickName"),
		  otherNickName = $("#otherNickName");

  var socket = io(),
      id = Number(window.location.href.split('/')[4]);
  // alert(id);

  socket.on('connect', function(){
    socket.emit('load', id);
	});

  var name = "";
  socket.on('totalchatpeople', function(data){
    if(data.count === 0){
      showMessage('newChat');

      loginForm.on('submit', function(e){
        e.preventDefault();
        name = $.trim(selfNickName.val());
        //alert(name);

        if(name.length < 2){
					alert("Please enter a longer nick name!");
					return;
				}

        showMessage("inviteSomebody");

        socket.emit('login', {user: name, id: id});
      });
    } else {
      showMessage('existingChat');

      loginForm.on('submit', function(e){
        e.preventDefault();
        name = $.trim(otherNickName.val());
        //alert(name);

        if(name.length < 2){
					alert("Please enter a longer nick name!");
					return;
				}

        socket.emit('login', {user: name, id: id});
      });
    }
  });

  function showMessage(status,data){
		if(status === "newChat"){

			section.children().css('display', 'none');
			chatLogin.fadeIn(1200);
		}
  }
}

window.onload = _init;
