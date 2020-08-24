//npm libs
const Discord = require('discord.js'); //discord core library
const enmap = require('enmap'); //enmap object for command handler
const fs = require('fs'); //filesystem module
const schedule = require('node-schedule'); //yet useless
require('npm-package-to-env').config(); //importing version value from package.json
require('./extensions/errorHandler'); //handling thrown errors

//JSON data
const config = require('./src/json/config.json');
const perms = require('./src/json/perms.json');
const auth = require('./src/json/auth');

//global Discord client extras
const client = new Discord.Client(); //declaring new Discord client user as a global variable
client.config = config; //global config
client.perms = perms; //global permission set export
client.auth = auth; //global authentication credentials
client.commands = new enmap(); //declaring enmap for command handler
client.version = process.env.npm_package_version; //global version
client.RC = require('reaction-core'); //module for ahndling reactions
client.RCHandler = new client.RC.Handler; //reaction-core handler
client.fs = fs; //global filesystem module
client.schedule = schedule; //yet useless
client.tr = {}; //object used to store sets of talkedRecently (used by lidl leveling system)
client.rank = new Set(); //set for cooldowning level check command

//handlers and global function exports
require('./src/functions/loadEvents')(client); //event handler
require('./src/functions/loadCommands')(client); //command handler

//Discord authentication
client.db = require('./src/functions/mongodb');
client.db.connect((err, mongoclient) => {
    if (err) return console.error(`[!mongodb] Error while connecting:\n${err}`);
    console.log('[mongodb] connected to mongodb!');
    client.login(auth.token); //with Discord bot token
});
