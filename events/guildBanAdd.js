module.exports = (client, guild, user) => {
    if (guild.id !== client.config.guildID) return;
    console.log(`[guildBanAdd] user '${user.tag}' was banned from '${guild.name}'`);
    
    let logs = client.channels.get(client.config.channels.logs);
    let verLogs = client.channels.get(client.config.channels.verLogs);
    
    if (logs) require(`../src/embeds/banAddRemove`)(client, user, logs, true);
    if (verLogs) require(`../src/embeds/banAddRemove`)(client, user, verLogs, true);
    
    if (!logs) return console.log(`{ERROR} [guildBanAdd] Channel with an ID ${client.config.channels.logs} does not exist in client.channels collaction!`);
    if (!verLogs) return console.log(`{ERROR} [guildBanAdd] Channel with an ID ${client.config.channels.verLogs} does not exist in client.channels collaction!`);
}