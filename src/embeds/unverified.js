module.exports = (client, message, mod, newcomer) => {
    var embed = {
        color: 0xff0049,
        timestamp: new Date(),
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        fields: [
            {
                name: 'Successfully unverified!',
                value: `${mod} unverified ${newcomer}.`
            }
        ]
    }
    return [
        message.channel.send({embed:embed}).then(msg => {if (client.config.delete.command) msg.delete(client.config.delete.time);}),
        console.log(`(unver) '${mod.tag}' unverified '${newcomer.tag}'`)
    ];
}