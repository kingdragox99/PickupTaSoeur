const express = require("express");
var https = require("https");
const fs = require("fs");
const dotenv = require("dotenv").config();
const steam = require("steam-login");
const Router = require("./routes/routes");

const port = 3080;
const oneDay = 1000 * 60 * 60 * 24;

const app = express();

app.set("view engine", "ejs");

app.use(
  require("express-session")({
    cookie: { maxAge: oneDay },
    resave: false,
    saveUninitialized: false,
    secret: "am i a god ?",
  })
);

app.use(
  steam.middleware({
    realm: "https://localhost:" + port + "/",
    verify: "https://localhost:" + port + "/verify",
    apiKey: process.env.STEAM_API,
  })
);

app.use(Router);

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
