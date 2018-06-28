'use strict';
const express = require("express");
const router = express.Router();

const facebookHandler = require('./facebook');
const smsHandler = require('./sms');

router.use('/facebook', facebookHandler);
router.use('/smsbot', smsHandler);

module.exports = router;