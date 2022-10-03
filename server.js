const express = require("express");
var https = require("https");
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv").config();
const steam = require("steam-login");
const Router = require("./routes/routes");

// usefull const you can change

const port = 3080;
const oneDay = 1000 * 60 * 60 * 24;

const app = express();

// Render ejs + Tailwind
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use("/assets", express.static("assets"));


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
    realm: "https://localhost:" + port + "/",
    verify: "https://localhost:" + port + "/verify",
    apiKey: process.env.STEAM_API,
  })
);

// import router

app.use(Router);

// make HTTPS and url

https
  .createServer(
    {
      key: fs.readFileSync("ssl/key.pem"),
      cert: fs.readFileSync("ssl/cert.pem"),
    },
    app
  )
  .listen(port, () => {
    console.log("Server is running at port " + port);
    console.log("https://localhost:" + port);
  });
