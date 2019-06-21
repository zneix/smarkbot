const fs = require('fs');
const enmap = require('enmap');
const discord = require('discord.js');
const bot = new discord.Client();
const config = require('./config.json');
bot.config = config;
bot.commands = new enmap();
fs.readdir("./events", (err, files) => {
    files.forEach(file => {
        if (err) return console.error(err);
        let event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        bot.on(eventName, event.bind(null, bot));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});
fs.readdir("./commands", (err, files) => {
    files.forEach(file => {
        if (err) return console.error(err);
        if (!file.endsWith(".js")) return null;
        let props = require(`./commands/${file}`);
        let commandName = file.split(".")[0];
        console.log(`Attempting to load command ${commandName}`);
        bot.commands.set(commandName, props);
    });
    console.log(`\nCommands loaded, preparing to auth the WebSocket!\n=================================================`);
});
bot.login(process.env.token);