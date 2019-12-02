module.exports = (client, oldMessage, newMessage) => {
    if (newMessage.channel.type === "dm") return;
    if (newMessage.guild.id !== client.config.guildID) return;
    if (newMessage.author.bot || !newMessage.editedTimestamp) return;

    console.log(`[messageUpdate] message '${newMessage.id}' edited in '${newMessage.channel}'`);
    let verLogs = client.channels.get(client.config.channels.verLogs);
    if (verLogs) require('../src/embeds/messageUpdate')(client, oldMessage, newMessage, verLogs);
}