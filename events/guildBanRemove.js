module.exports = (client, guild, user) => {
    if (guild.id !== client.config.guildID) return;
    console.log(`[guildBanRemove] user '${user.tag}' was unbanned from '${guild.name}'`);

    require('../src/functions/hardbanHandler').unbanned(guild, user); //hardban check

    let logs = client.channels.get(client.config.channels.logs);
    let verLogs = client.channels.get(client.config.channels.verLogs);
    
    if (logs) require('../src/embeds/banAddRemove')(client, user, logs, false);
    if (verLogs) require('../src/embeds/banAddRemove')(client, user, verLogs, false);
    
    if (!logs) return console.log(`{ERROR} [guildBanRemove] Channel with an ID ${client.config.channels.logs} does not exist in client.channels collaction!`);
    if (!verLogs) return console.log(`{ERROR} [guildBanRemove] Channel with an ID ${client.config.channels.verLogs} does not exist in client.channels collaction!`);
}