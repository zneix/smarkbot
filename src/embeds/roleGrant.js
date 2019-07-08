module.exports = (client, message, role, user, filename) => {
    var embed = {
        color: 0x00ff00,
        timestamp: new Date(),
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        fields: [
            {
                name: `Role granted!`,
                value: `Added role ${role} to ${user}.`
            }
        ]
    }
    return [
        message.channel.send({embed:embed}).then(msg => {if (client.config.delete.command) msg.delete(client.config.delete.time);}),
        console.log(`(${filename}) added role ${role.name} to ${user.tag}`)
    ]
}