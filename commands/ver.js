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
                message.guild.member(latestMember).addRole(role)
                .then(() => message.channel.send(latestMember.user.tag+` was granted a member role successfully!`));
                console.log(`(ver-latest) '${message.author.tag}' verified '${latestMember.user.tag}'`);
                } catch {e => console.log(e);};
                return null;
            }
            if (args[0] === `all`) {
                console.log(`((ver-all)) triggered by `+message.author.tag);
                var count = 0;
                try {
                    message.guild.members.forEach(member => {
                    if (member.roles.has(role.id) || member.user.bot) return null;
                    member.addRole(role);
                    count = count+1;
                    console.log(`   Verified user `+member.user.tag);
                    });
                    message.channel.send(`All unverified users are now granted a member role!\ntotal changes: `+count);
                    console.log(`((ver-all)) ended!`);
                } catch {e => console.log(e);}
                return null;
            }
            return message.reply(`the ID you provided is invalid PepeLaugh`);
        }
        try {message.guild.member(validUID).addRole(role)
            .then(() => message.channel.send(validUID.tag+` was granted a member role successfully!`));
            console.log(`(ver) '${message.author.tag}' verified '${validUID.tag}'`);
        } catch {e => console.log(e);}
    }
    else {
        try {
            message.guild.member(taggedUser).addRole(role)
            .then(() => message.channel.send(taggedUser.tag+` was granted a member role successfully!`));
            console.log(`(ver) '${message.author.tag}' verified '${taggedUser.tag}'`);
        } catch {e => console.log(e);}
    }
}