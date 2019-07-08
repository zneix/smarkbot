exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Verifies provided user.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [user_ID | @mention | latest]`
exports.perms = `mod`

exports.run = async (client, message) => {
    message.command(1, async () => {
        if (!message.guild.member(message.author).hasPermission('MANAGE_ROLES')) throw `You're missing permissions!`
        const taggedUser = message.mentions.users.first();
        const role = message.guild.roles.get(client.config.roles.member);
        if (!role) return require(`../src/embeds/verificationProblem`)(client, message, `⚠ Role missing! ⚠`, `The role with an ID ${client.config.roles.member} does not exists!\n**Contact admins or zneix immediately!\nTHIS CODE SHOULD NEVER EXECUTE !!!!!!1!!11!111!!!!!!11!!**`);
        if (!taggedUser) {
            let validUID = message.guild.members.get(message.args[0]);
            if (!validUID) {
                if (message.args[0] === `latest`) {
                    if (!client.config.latestMember) return require(`../src/embeds/verificationProblem`)(client, message, `Property does not exist!`, `Use an user ID or @mention.`);
                    try {
                    message.guild.member(latestMember).addRole(role).then(() => {return require(`../src/embeds/verified`)(client, message, message.author, latestMember.user)});
                    } catch {e => console.log(e);};
                    return;
                }
                /* TODO: Finish this someday....
                if (message.args[0] === `all`) {
                    console.log(`((ver-all)) triggered by `+message.author.tag);
                    var count = 0;
                    try {
                        message.guild.members.forEach(member => {
                        if (member.roles.has(role.id) || member.user.client) return;
                        member.addRole(role);
                        count = count+1;
                        console.log(`   Verified user `+member.user.tag);
                        });
                        message.channel.send(`All unverified users are now granted a member role!\ntotal changes: `+count);
                        console.log(`((ver-all)) ended!`);
                    } catch {e => console.log(e);}
                    return;
                }
                */
                throw `Provided ID \`${message.args[0]}\` is invalid!`
            }
            try {message.guild.member(validUID).addRole(role).then(() => {return require(`../src/embeds/verified`)(client, message, message.author, validUID)});
            } catch {e => console.log(e);}
        }
        else {
            try {
                message.guild.member(taggedUser).addRole(role).then(() => {return require(`../src/embeds/verified`)(client, message, message.author, taggedUser)});
            } catch {e => console.log(e);}
        }
    });
}