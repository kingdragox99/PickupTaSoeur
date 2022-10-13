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

const url = process.env.URL; // you need to change for deploy
const port_http = process.env.PORT_HTTP;
const port_https = process.env.PORT_HTTPS;
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
var io = require("socket.io")(process.env.PORT_WS, {
  cors: {
    origin: "*",
  },
});

// connect socket io
let roomArray = []; // array des room
let userGardeFou = []; // garde fous pour créer une room par user
let match = []; // match array
const map = [
  "nuke",
  "overpass",
  "dust2",
  "ancient",
  "mirage",
  "vertigo",
  "inferno",
];

io.on("connection", (socket) => {
  // login user
  socket.on("login", (user) => {
    socket.id = user;
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
        }
      });

      socket.on("delete room", (room) => {
        let newRoomArray = roomArray.filter((data) => data.user != socket.id);
        let newMatch = match.filter((data) => data.id != room.id);

        const newuserGardeFou = userGardeFou.map((obj) => {
          if (obj.user === socket.id) {
            return { ...obj, create: true };
          }

          return obj;
        });
        userGardeFou = newuserGardeFou;
        roomArray = newRoomArray;
        match = newMatch;
      });
    }

    // connection to room
    socket.on("join", (data) => {
      console.log(`${data.user} join room ${data.id}`);

      // garde fous double cration dans l'array match
      const checkMatch = match.some((element) => {
        if (element.id === data.id) {
          return true;
        } else {
          return false;
        }
      });

      // garde fou match verif
      if (checkMatch === false) {
        // on cree le match
        match.push({
          id: data.id,
          teamnoteam: [],
          teamone: [],
          teamtwo: [],
          map: [...map.sort()],
        });
        socket.emit("fetchmatch", match);
      }

      // garde fous double cration dans l'array match user
      const checkMatchTeamNoTeam = match.some((element) => {
        if (element.teamnoteam !== "undefined") {
          return true;
        } else {
          return false;
        }
      });

      console.log(checkMatchTeamNoTeam);

      socket.on("array checker", (position) => {
        if (position != null) {
          // garde fous double cration dans l'array match user
          const checkMatchUser = match.some((element) => {
            if (element.teamnoteam.includes(data.user)) {
              return true;
            } else {
              return false;
            }
          });
          console.log(checkMatchUser);
          if (checkMatchTeamNoTeam == true) {
            if (checkMatchUser == false) {
              match[position].teamnoteam.push(socket.id);
              socket.emit("fetchmatch", match);
              console.log(match);
            }
          }

          socket.on("leave room", (element) => {
            let userPose = match[position].teamnoteam.indexOf(element.user);
            if (userPose > -1) {
              match[position].teamnoteam.splice(userPose, 1);
              socket.emit("fetchmatch", match);
            }
          });
        }
      });
    });

    socket.emit("fetchmatch", match);
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
