const express = require("express");
const mongoose = require("mongoose");
const steam = require("steam-login");
const Router = require("./routes/routes");
const dbConnect = require("./config/db");
const steamLog = require("./config/steamlog");

const port = 3000;

const app = express();

app.use(express.json());

mongoose.connect(dbConnect, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error: "));
db.once("open", function () {
  console.log("Connected successfully");
});

app.use(
  require("express-session")({
    resave: false,
    saveUninitialized: false,
    secret: "a secret",
  })
);

app.use(
  steam.middleware({
    realm: "http://localhost:" + port + "/",
    verify: "http://localhost:" + port + "/verify",
    apiKey: steamLog,
  })
);

app.use(Router);

app.listen(port, () => {
  console.log("Server is running at port " + port);
});
