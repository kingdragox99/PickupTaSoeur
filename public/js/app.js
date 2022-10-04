const socket = io("ws://localhost:1337");

socket.on("message", (text) => {
  const el = document.createElement("li");
  el.innerHTML = text;
  document.querySelector("ul").appendChild(el);
});

document.getElementById("salut").onclick = () => {
  const text = document.querySelector("input").value;
  socket.emit("message", text);
};
