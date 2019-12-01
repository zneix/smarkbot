let cooldown = 30000;
exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Allows you to check your level progress (has ${cooldown/1000}s cooldown).`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = 'user';
// exports.home = true;

exports.run = async (client, message) => {
    message.command(false, async () => {
        //lidl command cooldown
        if (client.rank.has(message.author.id)) throw `You can only use that command once per **${cooldown/1000} seconds**!`;
        client.rank.add(message.author.id);
        setTimeout(function(){client.rank.delete(message.author.id)}, cooldown);

        //actual response
        let userLvl = (await client.db.lvl.findUser(message.guild.id, message.author.id))[0];
        if (!userLvl) (await client.db.lvl.newUser(message.guild.id, message.author.id))[0];
        require(`../src/embeds/rankCheck`)(message, userLvl);
    });
}