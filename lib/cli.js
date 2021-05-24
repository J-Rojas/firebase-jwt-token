#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var yargs = require("yargs");
var index_1 = require("./index");
var args = yargs.options({
    decode: {
        type: "boolean",
        alias: "d",
        description: "Return decoded token as json instead of JWT Token",
    },
    email: {
        type: "string",
        alias: "e",
        default: process.env.FJT_EMAIL,
        required: false,
        description: "User's Email to log in with. Optionally use environment variable FJT_EMAIL",
    },
    password: {
        type: "string",
        alias: "p",
        default: process.env.FJT_PASSWORD,
        required: false,
        description: "User's Password to log in with. Optionally use environment variable FJT_PASSWORD",
    },
    uid: {
        type: "string",
        alias: "u",
        default: process.env.FJT_UID,
        required: false,
        description: "The User's uid. Optionally use environment variable FJT_UID",
    },
    key: {
        type: "string",
        alias: "k",
        default: process.env.FJT_KEY,
        required: true,
        description: "Firebase Project's Web API Key (can be found under project settings). Optionally use environment variable FJT_KEY",
    },
})
    .check(function (argv) {
    if (!argv.uid) {
        if (!argv.password || !argv.email) {
            throw new Error("Missing required arguments: password and email.");
        }
    }
    return true;
})
    .conflicts("uid", ["password", "email"])
    .conflicts("password", ["uid"])
    .conflicts("email", ["uid"])
    .argv;
var app = new index_1.FirebaseJWTToken(args.key);
if (args.uid) {
    app
        .getTokenFromUid(args.uid, args.decode)
        .then(function (token) { return console.log(token); });
}
else {
    app
        .getToken(args.email, args.password, args.decode)
        .then(function (token) { return console.log(token); });
}
