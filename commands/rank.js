exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Allows you to check your level progress (has 30s cooldown).`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`
exports.perms = `user`

exports.run = async (client, message) => {
    message.command(false, async () => {
        if (client.lvlcd.has(message.author.id)) throw "You can use that command once per **30 seconds**!\nTry again later."

        //cooldown thingy
        client.lvlcd.add(message.author.id);
        setTimeout(function(){client.lvlcd.delete(message.author.id)}, 30000);

        //actual response
        var conn = await client.mysql.createConnection(client.auth.db);
        var [rows, fields] = await conn.query(`SELECT * FROM \`smarkbot_levels\` WHERE uid = ${message.author.id}`);
        if (!rows.length) {
            await conn.query(`INSERT INTO \`smarkbot_levels\` (pk, uid, xp, lvl) VALUES (NULL, ${message.author.id}, 0, 0)`),
            await require(`../src/embeds/rankCheck`)(message, rows[0]["xp"], rows[0]["lvl"])
            return conn.destroy();
        }
        await require(`../src/embeds/rankCheck`)(message, rows[0]["xp"], rows[0]["lvl"])
        return await conn.destroy();
    });
}