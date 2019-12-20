module.exports = (client, message, mod, newcomer) => {
    let embed = {
        color: 0x00ff49,
        timestamp: new Date(),
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        fields: [
            {
                name: 'Successfully verified!',
                value: `${mod} verified ${newcomer}.`
            }
        ]
    }
    return [
        message.channel.send({embed:embed}).then(msg => {if (client.config.delete.command) msg.delete(client.config.delete.time);}),
        console.log(`(ver) '${mod.tag}' verified '${newcomer.tag}'`)
    ];
}