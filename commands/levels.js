exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Displays lightweight leaderboard of top 100.';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = 'user';

exports.run = async (client, message) => {
    message.command(false, async () => {
        let data = await client.db.lvl.getLeaderboard(message.guild.id);
        let pages = Math.ceil(data.length/10);
        let page = 1;
        let embed = {
            color: Math.floor(Math.random()*256*256*256),
            timestamp: message.createdAt,
            footer: {
                text: `Requested by ${message.author.tag}`,
                icon_url: message.author.avatarURL
            },
            author: {
                name: `Leaderboard of ${message.guild.name}, Page ${page}/${pages}`
            },
            description: buildDesc(page-1)
        }
        function actualXP(lvl){
            let sum = 0;
            for (i=0;i<lvl;i++) sum += (5 * Math.pow(i, 2) + 50 * i + 100);
            return sum;
        }
        function putMember(index){return `**${index+1}.** __${message.guild.member(data[index]["userid"])?`${message.guild.members.get(data[index]["userid"])} (${message.guild.members.get(data[index]["userid"]).user.tag})`:`User Left (${data[index]["userid"]})`}__\nLvl: **${data[index]["lvl"]}** Exp: **${data[index]["xp"]-actualXP(data[index]["lvl"])}**/**${(actualXP(data[index]["lvl"]+1)-actualXP(data[index]["lvl"]))}** (tot. ${data[index]["xp"]})\n`;}
        function buildDesc(page){
            let str = '';
            for (i=0;i<10;i++) str = str.concat(putMember(page*10+i));
            return str;
        }
        let msg = await message.channel.send({embed:embed});
        await msg.react('1️⃣');
        await msg.react('⬅');
        await msg.react('➡');
        await msg.react('🇽');
        const collector = msg.createReactionCollector((reaction, user) => user.id == message.author.id, {time: 120000});
        collector.on('collect', async r => {
            await r.users.remove(message.author.id);
            switch (r.emoji.name){
                case '1️⃣':
                    page = 0;
                    break;
                case '➡':
                    if (page >= pages) return;
                    page++;
                    break;
                case '⬅':
                    if (page <= 1) return;
                    page--;
                    break;
                case '🇽':
                    return collector.stop();
            }
            await msg.edit();
        });
        collector.on('end', () => {msg.clearReactions();});
    });
}