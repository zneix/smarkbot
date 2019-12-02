let cooldown = 5000;
exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Allows you to check your level progress (has ${cooldown/1000}s cooldown).`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = 'user';

exports.run = async (client, message) => {
    message.command(false, async () => {
        //lidl command cooldown
        if (client.rank.has(message.author.id)) throw `You can only use that command once per **${cooldown/1000} seconds**!`;
        client.rank.add(message.author.id);
        setTimeout(function(){client.rank.delete(message.author.id)}, cooldown);

        //actual response
        if (message.args[0]){
            if (message.mentions.members.size){
                if (message.args[0].includes(message.mentions.members.first().id)){
                    let userLvl = (await client.db.lvl.findUser(message.guild.id, message.mentions.members.first().id))[0];
                    if (!userLvl) userLvl = await client.db.lvl.newUser(message.guild.id, message.mentions.members.first().id);
                    return require(`../src/embeds/rankCheck`)(message, userLvl);
                }
                else throw 'Command argument is not a valid member ID or @Mention';
            }
            let userLvl = (await client.db.lvl.findUser(message.guild.id, message.args[0]))[0];
            if (!userLvl) {
                if (message.guild.member(message.args[0])) userLvl = await client.db.lvl.newUser(message.guild.id, message.args[0]);
                else throw 'Command argument is not a valid member ID or @Mention';
            }
            require(`../src/embeds/rankCheck`)(message, userLvl);
        }
        else {
            let userLvl = (await client.db.lvl.findUser(message.guild.id, message.author.id))[0];
            if (!userLvl) userLvl = await client.db.lvl.newUser(message.guild.id, message.author.id);
            require(`../src/embeds/rankCheck`)(message, userLvl);
        }
    });
}