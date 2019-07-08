module.exports = (client, message) => {
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
            //message handling
            return;
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