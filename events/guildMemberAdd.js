module.exports = (bot, member) => {
    if (member.guild.id === config.guildID) return null;
    try {config.latestMember = member;} catch {console.error();}
    console.log(`[guildMemberAdd] user '${member.user.tag}' joined guild '${member.guild.name}'`);
}