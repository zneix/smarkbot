module.exports = (client, oldMessage, newMessage, channel) => {
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
    let user = newMessage.author;
    let date = user.createdAt;
    let formattedDate = leadingZeroes(date.getDate())+"/"+leadingZeroes(date.getMonth()+1)+"/"+date.getFullYear()+", "+leadingZeroes(date.getHours())+":"+leadingZeroes(date.getMinutes())+":"+leadingZeroes(date.getSeconds());
    var embed = {
        color: 0xb38a04,
        timestamp: Date.now(),
        thumbnail: user.avatarURL,
        footer: {
            text: `${user.id} | ${oldMessage.id}`,
            icon_url: user.avatarURL
        },
        author: {
            name: `Message Edited`,
            icon_url: user.avatarURL
        },
        description: `${newMessage.author} in ${newMessage.channel} (after ${formattedMs(newMessage.editedTimestamp - (oldMessage.channel ? oldMessage.createdTimestamp : Date.parse(oldMessage.timestamp)) )}) `,
        fields: [
            {
                name: "Previous Message",
                value: oldMessage.channel?oldMessage.content?oldMessage.content:'null':"unknown, message wasn't cached before event emit"
            },
            {
                name: "New Message",
                value: newMessage.content?newMessage.content:'null'
            }

        ]
    }
    return client.channels.get(channel.id).send({embed:embed});
}