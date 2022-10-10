const express = require("express");
const app = express();
var https = require("https");
var http = require("http");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv").config();
var cors = require("cors");
const steam = require("steam-login");
const Router = require("./routes/routes");
const uuid = require("uuid");

// usefull const you can change

const url = "localhost:"; // you need to change for deploy
const port_http = 3000;
const port_https = 3080;
const oneDay = 1000 * 60 * 60 * 24;

// Render ejs + Tailwind + js
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/public", express.static("public"));
app.use(express.static("public"));

// set sessions cockies and time

app.use(
  require("express-session")({
    cookie: { maxAge: oneDay },
    resave: false,
    saveUninitialized: false,
    secret: "am i a god ?",
  })
);

// steam login

app.use(
  steam.middleware({
    realm: "https://" + url + port_https + "/",
    verify: "https://" + url + port_https + "/verify",
    apiKey: process.env.STEAM_API,
  })
);

// import router

app.use(Router);

//use socket io

// socket io lunch
var io = require("socket.io")(1337, {
  cors: {
    origin: "*",
  },
});

// connect socket io
let roomArray = []; // array des room
let userGardeFou = []; // garde fous pour créer une room par user

io.on("connection", (socket) => {
  // join room index
  socket.room = "index";
  socket.join("index");

  // login user
  socket.on("login", (user) => {
    socket.id = user;
    console.log(roomArray);
    // si user = null
    if (user == "null") {
      console.log(`${socket.id} just connected`);
      socket.emit("fetch room", roomArray);
    } else {
      // si user est connecter faire suite
      console.log(`User ${user} just connect`);

      // garde fous double cration dans l'array check
      const checkUser = userGardeFou.some((element) => {
        if (element.user === socket.id) {
          return true;
        } else {
          return false;
        }
      });

      // check state true or flase du garde fou

      const checkStats = userGardeFou.some((element) => {
        if (element.create == true && element.user == socket.id) {
          return true;
        } else {
          return false;
        }
      });

      // creation de l'array garde fous de creation si deja ne rien faire
      if (checkUser == false) {
        userGardeFou.push({ user: socket.id, create: true });
      }

      console.log(userGardeFou);

      // fetch room on login
      socket.emit("fetch room", roomArray, socket.id);

      // room creation
      socket.on("create room server", (room) => {
        // check le garde fou
        if (checkStats == true) {
          const idroom = uuid.v4();

          // push array de la room
          roomArray.push({ id: idroom, user: socket.id });

          // on change le status du garde fou en false apres la creation de la game
          const newuserGardeFou = userGardeFou.map((obj) => {
            if (obj.user === socket.id) {
              return { ...obj, create: false };
            }

            return obj;
          });
          // changement de status du garde fou
          userGardeFou = newuserGardeFou;

          console.log(`${socket.id} create room id ${idroom}`);
          socket.to(socket.id).emit("fetch room", roomArray, socket.id);

          console.log(userGardeFou);
          console.log(roomArray);
        }
      });

      socket.on("delete room", (room) => {
        let newRoomArray = roomArray.filter((data) => data.user != socket.id);

        const newuserGardeFou = userGardeFou.map((obj) => {
          if (obj.user === socket.id) {
            return { ...obj, create: true };
          }

          return obj;
        });
        userGardeFou = newuserGardeFou;
        roomArray = newRoomArray;
      });
    }
    // connection to room

    socket.on("join", function (data) {
      socket.room = data;
      socket.join(data);
      console.log(`${socket.id} join room ${socket.room}`);
      socket.to(data).emit("debug client", "it's work");
    });
  });

  socket.on("disconnect", () => {
    console.log(`${socket.id} just leave`);
  });
});

// make HTTPS and HTTP url

https
  .createServer(
    {
      key: fs.readFileSync("ssl/private.key"),
      cert: fs.readFileSync("ssl/certificate.crt"),
      ca: fs.readFileSync("ssl/ca_bundle.crt"), // can be remove if you need
    },
    app
  )
  .listen(port_https, () => {
    console.log("Server is running");
    console.log("SSL Run on " + "https://" + url + port_https);
    console.log("Not secure on " + "http://" + url + port_http);
  });

http.createServer(app).listen(port_http, () => {});
