var express = require("express");
var router = express.Router();
var controller = require("../../app/Controller/smschatbot")

router.get("/webhook", controller.getwebhook);
router.post("/webhook", controller.setwebhook);

module.exports = router;