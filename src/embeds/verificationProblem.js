module.exports = (client, message, fname, fvalue) => {
    let embed = {
        color: 0xffed12,
        timestamp: new Date(),
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        fields: [
            {
                name: fname,
                value: fvalue
            }
        ]
    }
    return message.channel.send({embed:embed}).then(msg => {if (client.config.delete.command) msg.delete(client.config.delete.time);});
}