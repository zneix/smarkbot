module.exports = (client, user, channel, bool) => {
    function leadingZeroes(n){
        if (n<=9) return '0'+n;
        return n;
    }
    function formattedMs(n){
        if (n<=60000) return `${Math.floor(n/1000)}s`;
        if (n<=3600000) return `${Math.floor(n/60000)}m ${Math.floor(n/1000)-(Math.floor(n/60000)*60)}s`;
        if (n<=86400000) return `${Math.floor(n/3600000)}h ${Math.floor(n/60000)-(Math.floor(n/3600000)*60)}m`;
        return `${Math.floor(n/86400000)}d ${Math.floor(n/3600000)-(Math.floor(n/86400000)*24)}h`;
    }
    let date = user.createdAt;
    let formattedDate = leadingZeroes(date.getDate())+'/'+leadingZeroes(date.getMonth()+1)+'/'+date.getFullYear()+', '+leadingZeroes(date.getHours())+':'+leadingZeroes(date.getMinutes())+':'+leadingZeroes(date.getSeconds());
    let embed = {
        color: (bool?0xff5b42:0x5bff42), // Ban || Unban
        timestamp: Date.now(),
        thumbnail: user.avatarURL,
        footer: {
            text: `${user.id}`,
            icon_url: user.avatarURL
        },
        author: {
            name: `Member ${bool?'Banned':'Unbanned'}`,
            icon_url: user.avatarURL
        },
        description: `${user} ${user.tag}`,
        fields: [
            {
                name: 'Account Created:',
                value: `**${formattedDate}** (\`${formattedMs(Date.now() - user.createdTimestamp)}\` ago)`
            }
        ]
    }
    return client.channels.get(channel.id).send({embed:embed});
}