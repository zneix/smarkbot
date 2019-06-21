exports.run = (bot, message, args) => {
    if (!message.guild.member(message.author).hasPermission('MANAGE_ROLES')) return message.reply(`permissions missing!`);
    if (!args[0]) return message.reply(`gib user ID or tag!\nyou can also use \`latest\` or \`all\` here`);
    const taggedUser = message.mentions.users.first();
    const role = message.guild.roles.get(bot.config.memberRole);
    if (!role) return message.channel.send(`The role with an ID ${bot.config.member} does not exists!\nContact mods or zneix!`);
    if (!taggedUser) {
        let validUID = bot.users.get(args[0]);
        if (!validUID) {
            if (args[0] === `latest`) {
                if (!bot.config.latestMember) return message.channel.send(`I'm sorry, but property of latest user does not exist!\nYou'll have to use an ID or tag a user`);
                try {
                message.guild.member(latestMember).removeRole(role)
                .then(() => message.channel.send(latestMember.user.tag+` got rejected a member role successfully!`));
                console.log(`(unver-latest) '${message.author.tag}' unverified '${latestMember.user.tag}'`);
                } catch {e => console.log(e);};
                return null;
            }
            return message.reply(`the ID you provided is invalid PepeLaugh`);
        }
        try {message.guild.member(validUID).removeRole(role)
            .then(() => message.channel.send(validUID.tag+` got rejected a member role successfully!`));
            console.log(`(unver) '${message.author.tag}' unverified '${validUID.tag}'`);
        } catch {e => console.log(e);}
    }
    else {
        try {
            message.guild.member(taggedUser).removeRole(role)
            .then(() => message.channel.send(taggedUser.tag+` got rejected a member role successfully!`));
            console.log(`(unver) '${message.author.tag}' unverified '${taggedUser.tag}'`);
        } catch {e => console.log(e);}
    }
}