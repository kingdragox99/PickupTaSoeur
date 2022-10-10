// socket connect
const socket = io("ws://localhost:1337");

// get room list room and join

function getUserName() {
  username = document.getElementById("username");
  if (!username) {
    return "null";
  } else {
    return username.innerHTML;
  }
}
// get username of room
function getUserNameRoom(user) {
  username = document.getElementById(user).id;
  if (!username) {
    return "null";
  } else {
    return username;
  }
}

socket.on("connect", function () {
  socket.emit("login", getUserName());
  // warn message bug etc

  socket.on("warning", (warn) => {
    alert(warn);
  });

  socket.on("fetch room", (room, user) => {
    for (let i = 0; i < room.length; i++) {
      const a = document.createElement("a");
      a.innerHTML = `${room[i].id}`;
      a.href = "room/" + room[i].id;
      a.classList.add("text-white");
      a.classList.add("font-bold");
      a.classList.add("py-2");
      a.classList.add("px-4");
      a.id = room[i].user;
      const li = document.createElement("li");
      li.id = room[i].id;
      document.querySelector("ul").appendChild(li);
      document.getElementById(room[i].id).appendChild(a);
      console.log(room);
      console.log(getUserNameRoom(room[i].user));
      if (user == getUserNameRoom(room[i].user)) {
        const btnDeleted = document.createElement("button");
        btnDeleted.innerHTML = "delete";
        btnDeleted.classList.add("bg-red-500");
        btnDeleted.classList.add("hover:bg-red-700");
        btnDeleted.classList.add("text-white");
        btnDeleted.classList.add("font-bold");
        btnDeleted.classList.add("py-2");
        btnDeleted.classList.add("px-4");
        btnDeleted.classList.add("rounded");
        document.getElementById(room[i].id).appendChild(btnDeleted);

        btnDeleted.onclick = () => {
          socket.emit("delete room", room[i].id);
          location.reload();
        };
      }
    }
  });

  // create new room and get room
  const makeRoom = document.getElementById("room");
  if (makeRoom) {
    makeRoom.onclick = () => {
      socket.emit("create room server");
      location.reload();
    };
  }
});
