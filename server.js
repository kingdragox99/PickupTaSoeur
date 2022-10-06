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