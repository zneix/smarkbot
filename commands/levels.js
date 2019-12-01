exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Toggles 2137 event role on yourself.';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = 'user';
exports.home = false;

exports.run = async (client, message) => {
    message.command(false, async () => {
        //...
    });
}