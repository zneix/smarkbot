module.exports = async (client, message) => {
    if (message.author.bot || message.channel.type === "dm") return;
    try {
        let prefix = function(){return message.content.substr(0, client.config.prefix.length).toLowerCase();}
        if (prefix() == client.config.prefix) {
            let command = function(){return message.content.split(/ +/g).shift(1).slice(prefix().length).toLowerCase();}
            //args declaration
            message.args = message.content.slice(prefix().length).split(/ +/g);
            message.args.splice(0, 1);
            //command handling
            let cmd = client.commands.get(command());
            if (!cmd) return message.react('❓');
            //permission handler
            let perms = client.perms;
            ifOwner = function(){return perms.owner.includes(message.author.id);}
            ifAdmin = function(){return message.member.roles.some(r => perms.admin.includes(r.id));}
            ifSupermod = function(){return message.member.roles.some(r => perms.supermod.includes(r.id));}
            ifMod = function(){return message.member.roles.some(r => perms.mod.includes(r.id));}
            switch(cmd.perms){
                case "owner":
                    if (!ifOwner()) throw "This command requires **bot owner** permissions."
                    break;
                case "admin":
                    if (!ifOwner() && !ifAdmin()) throw "This command requires **bot admin** permissions."
                    break;
                case "supermod":
                    if (!ifOwner() && !ifAdmin() && !ifSupermod()) throw "This command requires **bot super moderator** permissions."
                    break;
                case "mod":
                    if (!ifOwner() && !ifAdmin() && !ifSupermod() && !ifMod()) throw "This command requires **bot moderator** permissions."
                    break;
                case "user":
                    //if forsen sees this, chat von ZULUL
                    break;
                default:
                    console.log(`{perms handler} unknown perms declaration (${cmd.perms})`);
                    throw "This command has unkown cmd.perms declaration!\nContact bot owner or see the switch-case module in message.js handler."
            }
            if (perms.ban.includes(message.author.id)) return message.react('🔨');
            cmd.run(client, message);
        }
        else {
            //message handling - levling system in action below

            //escaping various conditions...
            if (message.guild.id !== client.config.guildID) return; //guild
            if (client.config.blacklist.includes(message.channel.id) || client.config.blocked.includes(message.author.id)) return; //bl channels, bl users
            if (client.tr.has(message.author.id)) return; //cooldowned users

            //cooldown thingy
            client.tr.add(message.author.id);
            setTimeout(function() {client.tr.delete(message.author.id)}, 60000);

            const conn = await client.mysql.createConnection(client.auth.db);
            var [rows, fields] = await conn.execute(`SELECT * FROM \`smarkbot_levels\` WHERE uid = ${message.author.id}`);
            if (!rows.length) return await conn.execute(`INSERT INTO \`smarkbot_levels\` (pk, uid, xp, lvl) VALUES (NULL, ${message.author.id}, 0, 0)`);
            function randomXP(){return Math.floor(15 + Math.random()*11);}
            let random = randomXP();
            let sum = 0;
            let i = 0;
            do {
                sum = sum + (5 * Math.pow(i, 2) + 50 * i + 100);
                i++;
            } while (i < rows[0]["lvl"]+1);
            if ((rows[0]["xp"]+random) > sum) {
                //level up
                if (client.config.rewards[rows[0]["lvl"]+1]) {
                    //level up with role reward
                    let rewardRole = message.guild.roles.get(client.config.rewards[`${rows[0]["lvl"]+1}`]);
                    if (rewardRole) message.member.addRole(rewardRole);
                    let deletRole = message.guild.roles.get(client.config.rewards[`${rows[0]["lvl"]+1-4}`]);
                    if (deletRole) message.member.removeRole(deletRole);
                }
                //regular level up
                await conn.execute(`UPDATE \`smarkbot_levels\` SET xp = ${rows[0]["xp"]+random}, lvl = ${rows[0]["lvl"]+1} WHERE uid = ${message.author.id}`);
                //annoucment and log
                require(`../src/embeds/levelUp`)(message, rows[0]["lvl"]+1);
            }
            //regular xp add
            else await conn.execute(`UPDATE \`smarkbot_levels\` SET xp = ${rows[0]["xp"]+random} WHERE uid =${message.author.id}`);
        }
    }
    catch (err) {
        if (typeof err !== "string") err.stack = err;
        console.log(err);
        var embed = {
            color: 0xff5050,
            author: {
                name:message.channel.guild.name+" — \""+message.channel.name+"\"",
                icon_url: message.author.avatarURL
            },
            description: `There was an error in the message event:`,
            fields:[
                {
                    name: "Reason:",
                    value: err.substring(0,1023),
                }
            ],
            timestamp: new Date()
        }
        message.channel.send({embed:embed}).then(msg => {if (client.config.delete.error) msg.delete(client.config.delete.time);});
    }
}