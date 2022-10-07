const socket = io("ws://localhost:1337");

function getUserName() {
  username = document.getElementById("username");
  if (!username) {
    return null;
  } else {
    return username.innerHTML;
  }
}

let roomid = window.location.href.substring(
  window.location.href.lastIndexOf("/") + 1
);

const roomidp = document.getElementById("room-id");
roomidp.innerHTML = roomid;

// Connect to room with same id
socket.on("connect", function () {
  socket.emit("login", getUserName());
  socket.emit("join", roomid);
});

socket.on("debug client", (test) => {
  console.log(test);
});

console.log(roomid);
