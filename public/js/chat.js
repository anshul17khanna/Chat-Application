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
      chatScreen = $(".chatscreen"),
		  left = $(".left"),
      leftNickname = $(".nickname-left"),
		  chatForm = $("#chatform");

  var socket = io(),
      id = Number(window.location.href.split('/')[4]);
  // alert(id);

  socket.on('connect', function(){
    socket.emit('load', id);
    footer.css('display', 'none');
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

        chatLogin.fadeOut(500);
        socket.emit('login', {user: name, id: id});

        footer.fadeIn(500);
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

        footer.fadeIn(500);
      });
    }
  });

  socket.on('startChat', function(data){
    console.log(data);
  });

  socket.on('leave',function(data){
		if(data.boolean && id==data.room){
			showMessage("somebodyLeft", data);
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
		$("html, body").animate({ scrollTop: $(document).height() }, 1500);
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

  function showMessage(status,data){
    if(status === "newChat"){
			section.children().css('display', 'none');
			chatLogin.fadeIn(500);
		}

		else if(status === "existingChat"){
			chatLogin.css("display", "none");
			member.fadeIn(500);
			chatNickname.text(data.user);
		}

		else if(status === "chatStarted"){
			section.children().css('display','none');
			chatScreen.css('display','block');
		}

		else if(status === "somebodyLeft"){
      $('.chats').append('<div class="left"><div class="info"><h4 align="center"><i><span class="nickname-left">' +
                          data.user + '</span> has left the chat.</i></h4></div></div>');
			scrollToBottom();
		}
	}
}

window.onload = _init;
