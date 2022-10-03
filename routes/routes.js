const express = require("express");
const userModel = require("../models/models");
const steam = require("steam-login");
const app = express();

app.get("/", function (req, res) {
  res.render("pages/index", {
    user: req.user,
  });
});

app.get("/authenticate", steam.authenticate(), function (req, res) {
  res.redirect("/");
});

app.get("/verify", steam.verify(), function (req, res) {
  res.send(req.user).end();
  res.redirect("/");
});

app.get("/logout", steam.enforceLogin("/"), function (req, res) {
  req.logout();
  res.redirect("/");
});

app.get("/test", function (req, res) {
  res.render("pages/index", {
    user: req.user,
  });
});

module.exports = app;
