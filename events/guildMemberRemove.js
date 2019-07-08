module.exports = (client, member) => {
    if (member.guild.id !== client.config.guildID) return;
    console.log(`[guildMemberRemove] user '${member.user.tag}' left guild '${member.guild.name}'`);

    let logs = client.channels.get(client.config.channels.logs);
    let verLogs = client.channels.get(client.config.channels.verLogs);
    
    if (logs) require(`../src/embeds/memberAddRemove`)(client, member, logs, false);
    if (verLogs) require(`../src/embeds/memberAddRemove`)(client, member, verLogs, false);
    
    if (!logs) return console.log(`{ERROR} [guildMemberRemove] Channel with an ID ${client.config.channels.logs} does not exist in client.channels collaction!`);
    if (!verLogs) return console.log(`{ERROR} [guildMemberRemove] Channel with an ID ${client.config.channels.verLogs} does not exist in client.channels collaction!`);
}