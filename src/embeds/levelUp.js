module.exports = (message, lvl) => {
    var embed = {
        color: 0x8ed938,
        timestamp: new Date(),
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        fields: [
            {
                name: `Level up!`,
                value: `${message.author} just achieved level ${lvl}!`
            }
        ]
    }
    return [
        message.channel.send({embed:embed}),
        console.log(`{level-up} '${message.author.tag}' achieved level ${lvl}!`)
    ]
}