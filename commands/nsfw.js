exports.run = (bot, message, args) => {
    let nsfw = message.guild.roles.find(r => r.name === `nsfw`);
    if (!nsfw) message.channel.send(`Role named \`nsfw\` does not exist, contact admins or zneix!`);
    if (!message.member.roles.has(nsfw.id)) {
        message.member.addRole(nsfw);message.reply(`granted NSFW role ( ͡° ͜ʖ ͡°)`);
        console.log(`(nsfw) granted NSFW role to `+message.author.tag);
    }
    else {
        message.member.removeRole(nsfw);message.reply(`revoked NSFW role ( ͡° ʖ̯ ͡°)`);
        console.log(`(nsfw) revoked nsfw role from `+message.author.tag);
    }
}