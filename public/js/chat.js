// Client-Side

function _init(){
  var section = $(".section"),
      footer = $("footer"),
		  chatLogin = $(".chatLogin"),
		  member = $(".member"),
		  loginForm = $(".loginForm"),
		  selfNickName = $("#selfNickName"),
		  otherNickName = $("#otherNickName"),
      chatNickname = $(".nickname-chat"),
      chats = $(".chats"),
      textarea = $("#message"),
      msgTime = $(".msgTime"),
      inviteSomebody = $(".invite"),
      chatScreen = $(".chatscreen"),
		  left = $(".left"),
      leftNickname = $(".nickname-left"),
		  chatForm = $("#chatform");

  var socket = io(),
      id = Number(window.location.href.split('/')[4]);
  // alert(id);

  socket.on('connect', function(){
    socket.emit('load', id);
	});

  var name = "",
      friend = "";
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
      showMessage('existingChat',data);

      loginForm.on('submit', function(e){
        e.preventDefault();
        name = $.trim(otherNickName.val());
        //alert(name);

        if(name.length < 2){
					alert("Please enter a longer nick name!");
					return;
				}

        member.fadeOut(500);
        socket.emit('login', {user: name, id: id});
      });
    }
  });

  socket.on('startChat', function(data){
    console.log(data);

    if(console.boolean && data.id == id){
      chats.empty();

      if(name === data.users[0])
				showMessage("youStartedChatWithNoMessages",data);
			else
        showMessage("heStartedChatWithNoMessages",data);

			chatNickname.text(friend);
    }
  });

  socket.on('leave',function(data){
		if(data.boolean && id==data.room){
			showMessage("somebodyLeft", data);
			chats.empty();
		}
	});

  socket.on('receive', function(data){
		showMessage('chatStarted');

		if(data.msg.trim().length) {
			createChatMessage(data.msg, data.user, moment());
			scrollToBottom();
		}
	});

  textarea.keypress(function(e){
		if(e.which == 13) {
			e.preventDefault();
			chatForm.trigger('submit');
		}
	});

	chatForm.on('submit', function(e){
		e.preventDefault();
    showMessage("chatStarted");

		if(textarea.val().trim().length) {
			createChatMessage(textarea.val(), name, moment());
			scrollToBottom();

			socket.emit('msg', {msg: textarea.val(), user: name});
		}

		textarea.val("");
	});

  function scrollToBottom(){
		$("html, body").animate({ scrollTop: $(document).height()-$(window).height() },1000);
	}

  setInterval(function(){
		msgTime.each(function(){
			var each = moment($(this).data('time'));
			$(this).text(each.fromNow());
		});
	},1000);

  function createChatMessage(msg,user,now){
		var who = "";

		if(user === name){
			who = "self";
		} else{
			who = "other";
		}

    msgTime = $(".msgTime");
		msgTime.last().text(now.fromNow());

		var li = $('<li class=' + who + '>'+
	             '<div>' + '<b></b>' +
                '</div>' + '<p></p>' +
                '<i class="msgTime" data-time=' + now + '></i> '+
			         '</li>');

		li.find('p').text(msg);
		li.find('b').text(user);
    chats.append(li);

	}

  
}

window.onload = _init;
