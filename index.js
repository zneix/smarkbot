//npm libs
const Discord = require('discord.js'); //discord core library
const enmap = require('enmap'); //enmap object for command handler
const fs = require('fs'); //filesystem module
const schedule = require('node-schedule'); //yet useless
const mysql = require('mysql2/promise'); //library for communicating with MySQL database (/peomise is for async/await)
require('npm-package-to-env').config(); //importing version value from package.json
require(`./extensions/errorHandler`); //handling thrown errors

var Promise = require('bluebird'); //module for error handler and rejections while using fs.writeFile
Promise.config({longStackTraces:true}); //enabling long stack trees

//JSON data
const config = require('./src/json/config.json');
const perms = require('./src/json/perms.json');
const auth = require('./src/json/auth')(Promise);


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
client.mysql = mysql; //global mysql lib object (just in case)
client.tr = new Set(); //set for talkedRecently (used by lidl leveling system)
// client.dbConn = require(`./src/functions/mysqlConnect`)(mysql, auth); //global database connection

//mysql database connaction establish thingy
// let conn = client.mysql.createConnection(client.auth.db);
// client.conn = conn;

//handlers and global function exports
require(`./src/functions/loadEvents`)(client); //event handler
require(`./src/functions/loadCommands`)(client); //command handler
// client.query = async function query() {return await mysql.createConnection(auth.db);}

//Discord authentication
client.login(process.env.token); //with Discord bot token