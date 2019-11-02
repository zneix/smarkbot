const Discord = require('discord.js');
Discord.Message.prototype.command = async function(num, func){
    try {
        //args declaration
        args = this.content.split(/ +/g);
        args.splice(0, 1);

        //args.length clearance
        if (num) {
            if (num > args.length) throw `Too few arguments! (${args.length})`
        }

        //actual error "catcher"
        func().catch(async err => {
            console.log(err);
            console.trace(`Async/Promise rejection command error: ${err}`);
            var embed = {
                color: 0xff5050,
                timestamp: new Date(),
                author: {
                        name: this.guild.name+" — \""+this.channel.name+"\"",
                        icon_url: this.author.avatarURL
                },
                footer: {
                    text: "contact zneix#4433 for help"
                },
                description: "**"+this.author.username+"#"+this.author.discriminator+":"+this.author.id+"** failed to call: ***"+this.content+"***",
                fields: [
                    {
                        name: "Reason:",
                        value: err.toString().substring(0,1023),
                    }
                ]
            }
            this.channel.send({embed:embed}).then(msg => {if (this.client.config.delete.error) msg.delete(this.client.config.delete.time)});
        });
    }
    catch (error) {
        console.trace(`Sync command error: ${error}`);
        var embed = {
            color: 0xff5050,
            timestamp: new Date(),
            author: {
                    name: this.guild.name+" — \""+this.channel.name+"\"",
                    icon_url: this.author.avatarURL
            },
            footer: {
                text: "contact zneix#4433 for help"
            },
            description: "**"+this.author.username+"#"+this.author.discriminator+":"+this.author.id+"** failed to call: ***"+this.content+"***",
            fields: [
                {
                    name: "Reason:",
                    value: error.toString().substring(0,1023),
                }
            ]
        }
        this.channel.send({embed:embed}).then(msg => {if (this.client.config.delete.error) msg.delete(this.client.config.delete.time)});
    }
    //this.delete(0);
}