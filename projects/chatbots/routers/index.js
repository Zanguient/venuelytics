'use strict';
var express = require("express");
var router = express.Router();

var facebookHandler = require('./facebook');
var smsHandler = require('./sms');

router.use('/facebook', facebookHandler);
router.use('/smsbot', smsHandler);

module.exports = router;