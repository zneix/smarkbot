module.exports = (client, oldMessage, newMessage, channel) => {
    function formattedMs(n){
        if (n<=60000) return `${Math.floor(n/1000)}s`;
        if (n<=3600000) return `${Math.floor(n/60000)}m ${Math.floor(n/1000)-(Math.floor(n/60000)*60)}s`;
        if (n<=86400000) return `${Math.floor(n/3600000)}h ${Math.floor(n/60000)-(Math.floor(n/3600000)*60)}m`;
        return `${Math.floor(n/86400000)}d ${Math.floor(n/3600000)-(Math.floor(n/86400000)*24)}h`;
    }
    let user = newMessage.author;
    let embed = {
        color: 0xb38a04,
        timestamp: Date.now(),
        footer: {
            text: `${user.id} | ${oldMessage.id}`,
            icon_url: user.avatarURL
        },
        author: {
            name: 'Message Edited',
            icon_url: user.avatarURL
        },
        description: `${newMessage.author} in ${newMessage.channel} (after ${formattedMs(newMessage.editedTimestamp - (oldMessage.channel ? oldMessage.createdTimestamp : Date.parse(oldMessage.timestamp)) )})`,
        fields: [
            {
                name: 'Previous Message',
                value: oldMessage.channel?oldMessage.content?oldMessage.content:'null':"unknown, message wasn't cached before event emit"
            },
            {
                name: 'New Message',
                value: newMessage.content?newMessage.content:'null'
            }

        ]
    }
    return client.channels.get(channel.id).send({embed:embed});
}