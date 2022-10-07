// socket connect

const socket = io("ws://localhost:1337");

// get room list room and join

function getUserName() {
  username = document.getElementById("username");
  if (!username) {
    return null;
  } else {
    return username.innerHTML;
  }
}

socket.on("connect", function () {
  socket.emit("login", getUserName());

  socket.on("create room client", (room, id) => {
    const a = document.createElement("a");
    a.innerHTML = room;
    a.href = "room/" + id;
    a.classList.add("text-white");
    a.classList.add("font-bold");
    a.classList.add("py-2");
    a.classList.add("px-4");
    const li = document.createElement("li");
    li.id = id;
    document.querySelector("ul").appendChild(li);
    document.getElementById(id).appendChild(a);
  });

  // warn message bug etc

  socket.on("warning", (warn) => {
    alert(warn);
  });

  // create new room
  const makeRoom = document.getElementById("room");

  if (makeRoom) {
    makeRoom.onclick = () => {
      socket.emit("create room server");
    };
  }
});
