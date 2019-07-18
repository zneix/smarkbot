module.exports = (client, message, channel) => {
    function leadingZeroes(n){
        if (n<=9) return "0"+n;
        return n;
    }
    function formattedMs(n){
        if (n<=60000) return `${Math.floor(n/1000)}s`;
        if (n<=3600000) return `${Math.floor(n/60000)}m ${Math.floor(n/1000)-(Math.floor(n/60000)*60)}s`;
        if (n<=86400000) return `${Math.floor(n/3600000)}h ${Math.floor(n/60000)-(Math.floor(n/3600000)*60)}m`;
        return `${Math.floor(n/86400000)}d ${Math.floor(n/3600000)-(Math.floor(n/86400000)*24)}h`;
    }
    let user = message.author;
    let date = user.createdAt;
    let formattedDate = leadingZeroes(date.getDate())+"/"+leadingZeroes(date.getMonth()+1)+"/"+date.getFullYear()+", "+leadingZeroes(date.getHours())+":"+leadingZeroes(date.getMinutes())+":"+leadingZeroes(date.getSeconds());
    var embed = {
        color: 0x2b2321,
        timestamp: Date.now(),
        thumbnail: user.avatarURL,
        footer: {
            text: `${user.id} | ${message.id}`,
            icon_url: user.avatarURL
        },
        author: {
            name: `Message Deleted`,
            icon_url: user.avatarURL
        },
        description: `${message.author?message.author:'unknown#0000'} in ${message.channel}`,
        fields: [
            {
                name: "Deleted Message",
                value: message.content?message.content:'null'
            }
        ]
    }
    return client.channels.get(channel.id).send({embed:embed});
}