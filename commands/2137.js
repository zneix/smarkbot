exports.run = (bot, message, args) => {
    let okrutnik = message.guild.roles.find(r => r.name === `okrutnik`);
    if (!okrutnik) message.channel.send(`Role named \`okrutnik\` does not exist, contact admins or zneix!`);
    if (!message.member.roles.has(okrutnik.id)) {
        message.member.addRole(okrutnik);message.reply(`granted event role`);
        console.log(`(2137) granted event role to `+message.author.tag);
    }
    else {
        message.member.removeRole(okrutnik);message.reply(`revoked event role`);
        console.log(`(2137) revoked event role from `+message.author.tag);
    }
}