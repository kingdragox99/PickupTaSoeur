const express = require("express");
const userModel = require("../models/models");
const steam = require("steam-login");
const app = express();

app.post("/add_user", async (request, response) => {
  const user = new userModel(request.body);

  try {
    await user.save();
    response.send(user);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/users", async (request, response) => {
  const users = await userModel.find({});

  try {
    response.send(users);
  } catch (error) {
    response.status(500).send(error);
  }
});

app.get("/", function (req, res) {
  res
    .send(
      req.user == null
        ? "not logged in"
        : "hello " + req.user.username + " " + req.user.steamid
    )
    .end();
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

module.exports = app;
