module.exports = (client, member) => {
    function leadingZeroes(n){
        if (n<=9) return "0"+n;
        return n;
    }
    function formattedMs(n){
        if (n<=60000) return `${Math.floor(n/1000)}s`;
        if (n<=3600000) return `${Math.floor(n/60000)}m ${Math.floor(n/1000)-(Math.floor(n/60000)*60)}s`;
        if (n<=86400000) return `${Math.floor(n/3600000)}h ${Math.floor(n/60000)-(Math.floor(n/3600000)*60)}m`;
        return `${Math.floor(n/86400000)}d ${Math.floor(n/3600000)-(Math.floor(n/86400000)*24)}h`;
    }
    let date = member.user.createdAt;
    let formattedDate = leadingZeroes(date.getDate())+"/"+leadingZeroes(date.getMonth()+1)+"/"+date.getFullYear()+", "+leadingZeroes(date.getHours())+":"+leadingZeroes(date.getMinutes())+":"+leadingZeroes(date.getSeconds());
    const colors = {
        await: 0xfffc47,
        accepted: 0x00ff33,
        rejected: 0xff0033
    }
    const embed = {
        color: colors.await, // Join || Leave
        timestamp: Date.now(),
        footer: {
            text: `${member.user.id}`,
            icon_url: member.user.avatarURL
        },
        author: {
            name: `Member Joined`,
            icon_url: member.user.avatarURL
        },
        description: `${member.user} ${member.user.tag}\nReact to **verify/reject** member`,
        fields: [
            {
                name: `Account Created:`,
                value: `**${formattedDate}** (\`${formattedMs(Date.now() - member.user.createdTimestamp)}\` ago)`
            }
        ]
    }
    const buttons = [
        {
            emoji: '✅',
            run: async (user, message) => {
                const role = member.guild.roles.get(client.config.roles.member);
                member.addRole(role);
                //TODO: Add logs in here...
                let newEmbed = embed;
                embed.color = colors.accepted;
                embed.timestamp = new Date();
                embed.description = `${member.user} ${member.user.tag}\nMember **verified** by '${user.tag}'!`
                message.edit({embed:newEmbed});

                client.RCHandler.removeMenu(message.id);
                message.clearReactions();
            }

        },
        {
            emoji: '❌',
            run: async (user, message) => {
                //kicks an user
                member.kick(`moderator '${user.tag}' rejected this member`);
                let newEmbed = embed;
                embed.color = colors.rejected;
                embed.timestamp = new Date();
                embed.description = `${member.user} ${member.user.tag}\nMember **rejected** by '${user.tag}'!`
                message.edit({embed:newEmbed});

                client.RCHandler.removeMenu(message.id);
                message.clearReactions();
            }
        }
    ];
    return {
        embed: embed,
        buttons: buttons
    }
}