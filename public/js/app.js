// socket connect

const socket = io("ws://localhost:1337");

// get room list room and join

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

  document.getElementById(id).onclick = () => {
    socket.emit("debug");
  };
});

// warn message bug etc

socket.on("allready created client", (warn) => {
  alert(warn);
});

// create new room

document.getElementById("room").onclick = () => {
  socket.emit("create room server");
};
