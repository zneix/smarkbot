module.exports = (client, message) => {
    if (message.channel.type === "dm") return;
    if ((message.guild?message.guild.id:message.guild_id) !== client.config.guildID) return;
    if (message.author?message.author.bot:false) return; //can't reach message.author when message wasn't cached so this check doesn't work then (false flag)

    console.log(`[messageDelete] message '${message.id}' deleted in '${message.channel}'`);
    let verLogs = client.channels.get(client.config.channels.verLogs);
    if (verLogs) require(`../src/embeds/messageDelete`)(client, message, verLogs);
}