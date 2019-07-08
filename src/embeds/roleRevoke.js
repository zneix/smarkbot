module.exports = (client, message, role, user, filename) => {
    var embed = {
        color: 0xff0000,
        timestamp: new Date(),
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        fields: [
            {
                name: `Role revoked!`,
                value: `Revoked role ${role} from ${user}.`
            }
        ]
    }
    return [
        message.channel.send({embed:embed}).then(msg => {if (client.config.delete.command) msg.delete(client.config.delete.time);}),
        console.log(`(${filename}) revoked role ${role.name} from ${user.tag}`)
    ]
}