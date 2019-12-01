module.exports = async (client, message) => {
    if (message.author.bot || message.channel.type === "dm") return;
    try {
        //checking db records for existing config document
        let dbconfig = (await client.db.utils.find('guilds', {guildid: message.guild.id}))[0];
        if (!dbconfig) dbconfig = (await client.db.utils.newGuildConfig(message.guild.id)).ops[0];
        //defining prefix
        let guildprefix = dbconfig.customprefix===null?client.config.prefix:dbconfig.customprefix;
        //showing prefix on @Mention
        if (message.content.startsWith(client.user)) message.channel.send(`Hey ${message.author}, my prefix in this server is \`${guildprefix}\``);
        let prefix =  function(){return message.content.substr(0, guildprefix.length).toLowerCase();}
        if (prefix() === guildprefix) {
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
            if (message.guild.id !== client.config.guildID && cmd.home) throw "This command doesn't work outside my main server!";
            else cmd.run(client, message);
        }
        else {
            //message handling - levling system in action below
            //module: responses
            if (dbconfig.modules.responses.enabled) require('../src/functions/responseHandler')(message.content.toLowerCase(), message, client);

            //module: leveling
            //escaping various conditions...
            if (!dbconfig.modules.leveling.enabled) return;
            if (dbconfig.modules.leveling.blacklist.includes(message.channel.id) || dbconfig.modules.leveling.blocked.includes(message.author.id)) return;
            if (!client.tr[message.guild.id]) client.tr[message.guild.id] = new Set();
            if (client.tr[message.guild.id].has(message.author.id)) return;
            //cooldown thingy
            client.tr[message.guild.id].add(message.author.id);
            setTimeout(function(){client.tr[message.guild.id].delete(message.author.id)}, 60000);
            //fetching (or adding new) user profile from database
            let userLvl = (await client.db.lvl.findUser(message.guild.id, message.author.id))[0];
            if (!userLvl) userLvl = await client.db.lvl.newUser(message.guild.id, message.author.id);
            //rng 15-25
            let random = Math.floor(15 + Math.random()*11);
            //summary XP needed for next level
            let sum = 0;
            for (i=0;i<userLvl["lvl"]+1;i++){
                sum += (5 * Math.pow(i, 2) + 50 * i + 100);
            }
            //level up
            if ((userLvl["xp"]+random) > sum) {
                userLvl["lvl"]++;
                await client.db.lvl.updateUser(message.guild.id, userLvl);
                //level up annoucment
                switch(dbconfig.modules.leveling.announcetype){
                    case "embed":
                        require('../src/embeds/levelUp')(message, message.channel, userLvl["lvl"]);
                        break;
                    case "react":
                        let intEmotes = ['0️⃣', '1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣'];
                        await message.react('🎉');
                        for (i=0;i<userLvl["lvl"].toString().length;i++) await message.react(intEmotes[userLvl["lvl"].toString().slice(i, i+1)]);
                        break;
                    case "dm":
                        require('../src/embeds/levelUp')(message, message.author, userLvl["lvl"]);
                        break;
                    case "none":
                        break;
                }
                //level up with role reward
                if (dbconfig.modules.leveling.rewards[userLvl["lvl"]]) {
                    let rewardRole = message.guild.roles.get(dbconfig.modules.leveling.rewards[`${userLvl["lvl"]}`]);
                    if (message.guild.me.hasPermission('MANAGE_ROLES') && (rewardRole?(rewardRole.calculatedPosition < message.guild.me.highestRole.calculatedPosition):false)) message.member.addRole(rewardRole);
                }
            }
            //regular xp add
            userLvl.xp += random;
            await client.db.lvl.updateUser(message.guild.id, userLvl);
        }
    }
    catch (err) {
        // if (typeof err !== "string") err.stack = err;
        console.log(err);
        console.log('\n');
        console.log(err.toString());
        // var embed = {
        //     color: 0xff5050,
        //     author: {
        //         name:message.channel.guild.name+" — \""+message.channel.name+"\"",
        //         icon_url: message.author.avatarURL
        //     },
        //     description: `There was an error in the message event:`,
        //     fields:[
        //         {
        //             name: "Reason:",
        //             value: err.toString().substring(0,1023),
        //         }
        //     ],
        //     timestamp: new Date()
        // }
        // message.channel.send({embed:embed}).then(msg => {if (client.config.delete.error) msg.delete(client.config.delete.time);});
    }
}