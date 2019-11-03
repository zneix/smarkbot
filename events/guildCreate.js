module.exports = (client, guild) => {
    client.db.utils.newGuildConfig(guild.id);
}