exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Gives you root perms on a server if it has configured role management.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.home = true
exports.perms = 'owner';

exports.run = async (client, message) => {
    message.command(false, async () => {
        //...
    });
}