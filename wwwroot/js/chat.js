"use strict";

var connection = new signalR.HubConnectionBuilder().withUrl("/chatHub").build();

//Disable send button until connection is established
document.getElementById("sendButton").disabled = true;


function addMessage(type, user, message) {
   var msg = message.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
   var encodedMsg = "[" + type + "]" + user + " says " + msg;
   var li = document.createElement("li");
   li.textContent = encodedMsg;
   document.getElementById("messagesList").appendChild(li);
}

connection.on("ReceiveMessage", function (user, message) {
   addMessage("received", user, message);
});

connection.start().then(function () {
   connection.invoke("GetConnectionId").then(function (id) {
      document.getElementById("connectionId").innerText = id;
   })
   document.getElementById("sendButton").disabled = false;
}).catch(function (err) {
   return console.error(err.toString());
});

document.getElementById("sendButton").addEventListener("click", function (event) {
   var sender = document.getElementById("senderInput").value;
   var message = document.getElementById("messageInput").value;

   connection.invoke("SendMessage", sender, message).catch(function (err) {
      return console.error(err.toString());
   });

   event.preventDefault();
});

document.getElementById("sendToUser").addEventListener("click", function (event) {
   var sender = document.getElementById("senderInput").value;
   var receiver = document.getElementById("receiverInput").value;
   var message = document.getElementById("messageInput").value;

   addMessage("sent", sender, message);
   connection.invoke("SendMessageToUser", sender, receiver, message).catch(function (err) {
      return console.error(err.toString());
   });
   
   event.preventDefault();
});