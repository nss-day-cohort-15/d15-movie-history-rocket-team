"use strict";

let firebase = require("firebase/app"),
    fb = require("./fb-getter"),
    fbData = fb();

require("firebase/auth");

var config = {
  apiKey: fbData.key,
  authDomain: fbData.authUrl
};

firebase.initializeApp(config);

module.exports = firebase;
