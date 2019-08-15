exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Makes me speak.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)} [channel ID | #channel]`
exports.perms = 'supermod'

exports.run = (client, message) => {
    message.command(1, async () => {
        let taggedChannel = message.mentions.channels.first();
        if (!taggedChannel) {
            let validChannel = client.channels.get(message.args[0]);
            if (validChannel) return result(validChannel);
            else return result(false);
        }
        else return result(taggedChannel);
        function result(channel){
            message.delete();
            if (!channel) message.channel.send(message.args.join(" "));
            else channel.send(message.args.slice(1).join(" "));
        }
    });
}