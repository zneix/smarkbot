exports.run = async (bot, message, args) => {
    const m = await message.channel.send("Pong?");
    m.edit(`**Latency:** ${m.createdTimestamp - message.createdTimestamp}ms. \n**API Latency:** ${Math.round(bot.ping)}ms`);
    console.log(`(ping) user '${message.author.tag}' pinged!`);
}