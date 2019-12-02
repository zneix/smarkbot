module.exports = async (client, member) => {
    if (member.guild.id !== client.config.guildID) return;
    client.config.latestMember = member;
    console.log(`[guildMemberAdd] user '${member.user.tag}' joined guild '${member.guild.name}'`);

    require('../src/functions/hardbanHandler').joined(member); //hardban check
    
    let logs = client.channels.get(client.config.channels.logs);
    let verLogs = client.channels.get(client.config.channels.verLogs);
    
    const options = require('../src/rc-menus/acceptMenu')(client, member);
    let acceptMenu = new client.RC.Menu(options.embed, options.buttons);
    client.RCHandler.addMenus(acceptMenu);
    
    if (logs) logs.sendMenu(acceptMenu);
    if (verLogs) require('../src/embeds/memberAddRemove')(client, member, verLogs, true);
    
    if (!logs) return console.log(`{ERROR} [guildMemberRemove] Channel with an ID ${client.config.channels.logs} does not exist in client.channels collaction!`);
    if (!verLogs) return console.log(`{ERROR} [guildMemberRemove] Channel with an ID ${client.config.channels.verLogs} does not exist in client.channels collaction!`);
}