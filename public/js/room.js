const socket = io("ws://localhost:3000");

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
socket.on("connect", () => {
  socket.emit("login", getUserName());
  socket.emit("join", {
    id: roomid,
    user: getUserName(),
  });

  // on check la positon de l'obj demander
  socket.on("fetchmatch", (data) => {
    console.log(data);
    function idMatch() {
      const id = data.findIndex((x) => x.id === roomid);
      if (id == -1) {
        return null;
      } else {
        return id;
      }
    }
    console.log(idMatch());
    socket.emit("array checker", idMatch());
  });
});

socket.on("debug", (data) => {
  console.log(data);
});

// create new room and get room
const leaveRoom = document.getElementById("leaveroom");
if (leaveRoom) {
  leaveRoom.onclick = () => {
    socket.emit("leave room", {
      id: roomid,
      user: getUserName(),
    });
    window.location.replace("/");
  };
}
