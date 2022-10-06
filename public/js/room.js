const socket = io("ws://localhost:1337");

let roomid = window.location.href.substring(
  window.location.href.lastIndexOf("/") + 1
);

const roomidp = document.getElementById("room-id");
roomidp.innerHTML = roomid;

// On se conect a la room de meme id
socket.on("connect", function () {
  socket.emit("roomid", { id: roomid });
});

console.log(roomid);
