exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Toggles gore role on yourself.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`
exports.perms = `user`
exports.home = true

exports.run = async (client, message) => {
    message.command(false, async () => {
        let role = message.guild.roles.get(client.config.roles.gore);
        if (!role) throw `**${__filename.split(/[\\/]/).pop().slice(0,-3)}** role does not exist, contact admins or zneix!`
        if (!message.member.roles.has(role.id)) {
            await message.member.addRole(role);
            require(`../src/embeds/roleGrant`)(client, message, role, message.author, __filename.split(/[\\/]/).pop().slice(0,-3));
        }
        else {
            await message.member.removeRole(role);
            require(`../src/embeds/roleRevoke`)(client, message, role, message.author, __filename.split(/[\\/]/).pop().slice(0,-3));
        }
    });
}