module.exports = (message, xp, lvl) => {
    function reqXP(){
        let sum = 0;
        let i = 0;
        do {
            sum = sum + (5 * Math.pow(i, 2) + 50 * i + 100);
            i++;
        } while (i < lvl+1);
        return sum;
    }
    function actualXP(){
        let sum = 0;
        let i = 0;
        do {
            sum = sum + (5 * Math.pow(i, 2) + 50 * i + 100);
            i++;
        } while (i < lvl);
        return sum;
    }
    var embed = {
        color: 0xe7f135,
        timestamp: new Date(),
        footer: {
            text: message.author.tag,
            icon_url: message.author.avatarURL
        },
        author: {
            name: "Level progress"
        },
        fields: [
            {
                name: "Level",
                value: lvl,
                inline: true
            },
            {
                name: "Experience",
                value: xp-actualXP()+"/"+(reqXP()-actualXP())+` (total: ${xp})`,
                inline: true
            }
        ]
    }
    if (lvl = 0) embed.fields[1].value = xp+"/"+(reqXP()-actualXP())+` (total: ${xp})`
    message.channel.send({embed:embed});
}