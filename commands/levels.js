exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = 'Displays lightweight leaderboard of top 100.';
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = 'user';
exports.home = false;

exports.run = async (client, message) => {
    message.command(false, async () => {
        //...
    });
}