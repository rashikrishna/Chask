var user;
var currentchatroom;
if (!localStorage.getItem('user')) {
  user = prompt("Enter Your Username");
  const request = new XMLHttpRequest;
  request.onreadystatechange = function(){
    if(this.readyState == 4 && this.status == 200){
      document.querySelector("#user").innerHTML = `${user}`;
    }
  }
  request.open("POST","/adduser");
  const data = new FormData();
  data.append("user",user);
  request.send(data);
  localStorage.setItem('user',user);
}
else {
 user = localStorage.getItem('user');
}


//JavaScript Code:
document.addEventListener('DOMContentLoaded',function(){
  document.getElementById('user').innerHTML=`Welcome ${user}!!`;


  //Disabling Enabling send message button
  document.querySelector('#send-chat').disabled = true;
  document.querySelector('#message').onkeyup = () => {
    if (document.querySelector('#message').value != "")
      document.querySelector('#send-chat').disabled = false;
    else {
      document.querySelector('#send-chat').disabled = true;
    }
  };

//Disabling Enabling create chatroom button
  document.querySelector('#create-new-chatroom').disabled = true;
  document.querySelector('#new-chatroom').onkeyup = () => {
    if (document.querySelector('#new-chatroom').value != "")
      document.querySelector('#create-new-chatroom').disabled = false;
    else {
      document.querySelector('#create-new-chatroom').disabled = true;
    }
  };

  //Using SocketIO
  var socket = io.connect("http://127.0.0.1:5000/");
  // Broadcast a message
  socket.on("connect",function(){
    socket.emit("establish_connection", {
      data : "New User connected!!"
    })
  })
  //Capture message
  socket.on("response",function(abc){
    var newdiv = document.createElement('div');
    newdiv.className = "chats";
    newdiv.innerHTML = abc.data;
    document.querySelector("#list-of-chats").appendChild(newdiv);
  })
 //Create New chatroom
 socket.on("show_chatroom",function(data){
   var x=document.getElementById('chatroom-list')
   var c = document.createElement("option");
   c.text = data.chatroom;
   c.value = data.chatroom;
   x.options.add(c, 1);
   document.querySelector('#new-chatroom').value = "";
   document.querySelector('#create-new-chatroom').disabled = true;
 });

  //Functions for onclick event of different Events :
  document.querySelector('#enter-chatroom').onclick  = func2;
  document.querySelector('#create-new-chatroom').onclick = func;
  document.querySelector("#send-chat").onclick = sendm;


function func2(){
    currentchatroom = document.querySelector('#chatroom-list').value;
    localStorage.setItem('currentchatroom',currentchatroom);
    return false;
  };

function func(){
    var cr = document.querySelector('#new-chatroom').value;
    socket.emit("create_chatroom",{
      chatroom : cr
    });

};

function sendm(){
  var msg = document.querySelector('#message').value;
  var usr = localStorage.getItem('user');
  socket.emit("broadcast_message",{
    message : msg,
    user : usr
  });
};

socket.on("show_messages",function(data){
var newdiv = document.createElement('div');
newdiv.className = "chats";
newdiv.innerHTML = `<b>${data.user}</b> ${data.message}`;
document.querySelector("#list-of-chats").appendChild(newdiv);
document.querySelector("#message").value="";
document.querySelector("#send-chat").disabled=true;
})



})
