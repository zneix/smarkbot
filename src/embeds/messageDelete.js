module.exports = (client, message, channel) => {
    function formattedMs(n){
        if (n<=60000) return `${Math.floor(n/1000)}s`;
        if (n<=3600000) return `${Math.floor(n/60000)}m ${Math.floor(n/1000)-(Math.floor(n/60000)*60)}s`;
        if (n<=86400000) return `${Math.floor(n/3600000)}h ${Math.floor(n/60000)-(Math.floor(n/3600000)*60)}m`;
        return `${Math.floor(n/86400000)}d ${Math.floor(n/3600000)-(Math.floor(n/86400000)*24)}h`;
    }
    let user = message.author;
    var embed = {
        color: 0x2b2321,
        timestamp: Date.now(),
        footer: {
            text: `${user?`${user.id} | `:''}${message.id}`,
            icon_url: user?user.avatarURL:null
        },
        author: {
            name: 'Message Deleted',
            icon_url: user?user.avatarURL:''
        },
        description: `${user?user:'unknown#0000'} in ${message.channel} ${user?` (after ${formattedMs(Date.now() - message.createdTimestamp)})`:''}`,
        fields: [
            {
                name: 'Deleted Message',
                value: user?message.content?message.content:'null':"unknown, message wasn't cached before event emit"
            }
        ]
    }
    return client.channels.get(channel.id).send({embed:embed});
}