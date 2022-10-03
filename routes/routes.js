const express = require("express");
const steam = require("steam-login");
const app = express();
const fetch = require("node-fetch");
const dotenv = require("dotenv").config();

// main route

app.get("/", function (req, res) {
  res.render("pages/index", {
    user: req.user,
    kd: null,
  });
});

// auth with steam route

app.get("/authenticate", steam.authenticate(), function (req, res) {
  res.redirect("/");
});

// get all data after steam login

app.get("/verify", steam.verify(), function (req, res) {
  res.redirect("/");
});

// break session

app.get("/logout", steam.enforceLogin("/"), function (req, res) {
  req.logout();
  res.redirect("/");
});

// test link need to be deleted after for prod

app.get("/test", function (req, res) {
  res.render("pages/index", {
    user: req.user,
    kd: null,
  });
});

//fetch test

app.get("/testee", async (req, res) => {
  const steamid = () => {
    if (!req.user) {
      return "null";
    } else {
      return req.user.steamid;
    }
  };
  const url =
    "https://public-api.tracker.gg/v2/csgo/standard/profile/steam/" + steamid();
  const header = {
    "TRN-Api-Key": process.env.TRN_API_KEY,
  };
  try {
    await fetch(url, { headers: header })
      .then((res) => res.json())
      .then((data) => console.log(data.data.segments[0].stats.kd.displayValue));
  } catch (err) {
    console.log(err);
  }
});

module.exports = app;
