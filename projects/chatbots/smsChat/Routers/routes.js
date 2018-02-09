var express = require("express");
var api = express.Router();
var routers = require("./router")

api.use("/smschatbot", routers.smschatbot)

module.exports = api;