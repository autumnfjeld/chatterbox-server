
$(document).ready(function(){


var text;
var currentRoom = "main";
var incomingRooms = {"main":"main"};
var loadedRooms = {"main":"main"};
var userArray = [];
var friends = [];

var sendMessage = function(message){
  console.log("send");
  $.ajax({
  url: 'http://127.0.0.1:8080/messages',
  type: 'POST',
  data: JSON.stringify(message),
  contentType: 'application/json',
  success: function (data) {
    getMessage();
    console.log('chatterbox: Messages sent');
  },
  error: function (data) {
    console.log('data', data);
    // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
    console.error('chatterbox: Failed to send message');
  }
});
};

var getMessage = function(){
  console.log("get");
  $.ajax({
    url: 'http://127.0.0.1:8080/messages',
    type: 'GET',
    //data: {"order":"-createdAt"},
    contentType: 'application/json',
    success: function (data) {
      displayTexts(data);
      console.log('chatterbox: Messages received from:', this.url);
    },
    error: function (data) {
      // see: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message');
    }
  });
};

var displayTexts = function(data){
  data = JSON.parse(data);
  console.log('check all incoming data', data, 'typeof:',typeof data);
  console.log( '  Check first item in array:', data[0], 'typeof:', typeof data[0]);
  var $messages = $("<ul class='messages'></ul>").appendTo('.messagebox');
  $("span").remove();
  $("li").remove();
  //process incoming data - should be refactored into seperate funciton
  _.each(data, function(value){
    console.log('looping thru data', value.username);
    incomingRooms[value.room] = value.room;
    makeRoom();
    if(value.room && value.room === currentRoom){
      if(value.username && !_.contains(userArray,value.username)) {
        userArray.push(value.username);
        appendUsers();
      }
      //$messages.append("<li>"+value.username+"  "+"<span class='time'>"+moment(value.createdAt).fromNow()+"</span>"+"</li>");
      $messages.append("<li>" + value.username + "  " + "</span>" + "</li>");
      var $msgtext = $("<span class='text'></span>");
      $msgtext.text(value.text);
      $msgtext.appendTo($messages);
    }
  });
};


$(".write").keydown(function(event){
  var message = {};
  if(event.which === 13){
    message["username"]= window.username;// RED FLAG!!!!!!!!!window.location.search.split("=")[1];
    message["text"] = $(".write").val();
    message["timestamp"] = "10 min ago";
    message["room"] = currentRoom;
    $("input").val("");
    sendMessage(message);
  }
});

$(".room").click(function(){
  userRoom();
});

$("select").change(function(){
  console.log($(':selected').val());
  currentRoom = $(':selected').val();
  getMessage();
});

var makeRoom = function(){
  _.each(incomingRooms, function(value){
    if(!_.contains(loadedRooms, value)){
      var $room = $("<option></option>");
      $room.text(value).appendTo($("select"));
      loadedRooms[value] = value;
    }
  });
};

var userRoom = function(){
  var newRoom = prompt("Christian your room" || "Anon");
  currentRoom = newRoom;
  incomingRooms[newRoom] = newRoom;
  $("select").append("<option>"+currentRoom+"</option>");
  loadedRooms[newRoom] = newRoom;
  $("select").val(currentRoom);
  getMessage();
};

var appendUsers = function(){
  $(".userBox").empty();
  var $userList = $("<ul class='userList'></ul>").appendTo($(".userBox"));
  console.log('userList',$userList);
  _.each(userArray, function(value){
    var $userName = $("<li></li>");
    $userName.text(value);
    //console.log($userName);
    //$userList.append($userName.text(value));
    $userName.appendTo($userList);
  });
};

// NOTE!!! //think you must use userBox and not userList because userList doesn't exist on load
$(".userBox").on("click", 'li', function(){  
  if(!_.contains(friends, $(this).text)) friends.push($(this).text());
  console.log('checking this',$(this).text());
  console.log('in click');
});

getMessage();

});





