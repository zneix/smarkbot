//npm libs
const Discord = require('discord.js'); //discord core library
const enmap = require('enmap'); //enmap object for command handler
const fs = require('fs');
const schedule = require('node-schedule'); //yet useless
require('npm-package-to-env').config(); //importing version value from package.json
require(`./extensions/errorHandler`); //handling thrown errors

var Promise = require('bluebird'); //module for error handler and rejections while using fs.writeFile
Promise.config({longStackTraces:true}); //enabling long stack trees

//JSON data
const config = require(`./src/json/config.json`);
const perms = require(`./src/json/perms.json`);

//Discord client extras
const client = new Discord.Client();
client.config = config;
client.perms = perms;
client.commands = new enmap();
client.version = process.env.npm_package_version; //global version
client.RC = require('reaction-core'); //module for ahndling reactions
client.RCHandler = new client.RC.Handler;
client.fs = fs;
client.schedule = schedule; //yet useless

//handlers
require(`./src/functions/loadEvents`)(client); //event handler
require(`./src/functions/loadCommands`)(client); //command handler

//Discord authentication
client.login(process.env.token);