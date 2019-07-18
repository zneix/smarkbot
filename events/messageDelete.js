module.exports = (client, message) => {
    if (member.guild.id !== client.config.guildID) return;
    if (message.author.bot) return;

    console.log(`[messageDelete] message deleted in '${message.channel}'`);
    let verLogs = client.channels.get(client.config.channels.verLogs);
    if (verLogs) require(`../src/embeds/messageDelete`)(client, message, verLogs);
}