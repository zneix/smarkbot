module.exports = (bot, message) => {
    if (message.author.bot) return null;
    var mesLow = message.content.toLowerCase();
    if (!mesLow.startsWith(bot.config.prefix)) return null;
    const args = mesLow.slice(bot.config.prefix.length).split(/ +/);
    const command = args.shift();
    const cmd = bot.commands.get(command);

    if (!cmd) return null;
    cmd.run(bot, message, args);
}