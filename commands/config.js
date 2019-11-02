exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Changes bot prefix`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = `owner`;
exports.home = false;

exports.run = async (client, message) => {
    message.command(false, async () => {
        let data = (await client.db.utils.find('guilds', {guildid: message.guild.id}))[0];
        console.log(data);
        let colors = {
            native: 0xda7678,
            success: 0x51d559
        }
        let embed = {
            color: colors.native,
            timestamp: message.createdAt,
            footer: {
                text: message.author.tag,
                icon_url: message.author.avatarURL
            },
            author: {
                name: 'Select one of the modules to change their configuration:'
            },
            description:
            '`prefix` - changes or restores bot\'s prefix'
            +'\n`defaultrole` - manages default role (member role assigned to all members, e.g. @User)'
            +'\n`leveling` - manages leveling system'
            +'\n`responses` - enabled or diables reacting to messages'
            +'\n`autorole` - manages system of automatic role assignment via command'
            +'\n`logging` - manages logging system',
            fields: [
                {
                    name: 'current brief config',
                    value:
                    `prefix - ${data.customprefix?data.customprefix:(`${client.config.prefix} (default)`)}`
                    +`\ndefaultrole - ${data.defaultrole?`<@&${data.defaultrole}> (${data.defaultrole})`:'none'}`
                    +`\nleveling - ${data.modules.leveling.enabled?'enabled':'disabled'}, ${Object.getOwnPropertyNames(data.modules.leveling.rewards).length} rewards`
                    +`\nresponses - ${data.modules.responses.enabled?'enabled':'disabled'}`
                    +`\nautorole - ${data.modules.roles.enabled?'enabled':'disabled'}, ${Object.getOwnPropertyNames(data.modules.roles.units).length} configured roles`
                    +`\nlogging - ${data.modules.logging.enabled?'enabled':'disabled'}, join/leave: ${data.modules.logging.joinleave?`<#${data.modules.logging.joinleave}>`:'none'}, message: ${data.modules.logging.message?`<#${data.modules.logging.message}>`:'none'}`
                }
            ]
        }
        if (message.args.length) {
            switch(message.args[0].toLowerCase()){
                case "prefix":
                embed.description = '`set <new_prefix>` - changes prefix to given value (no spaces)'
                +'\n`reset` - removes custom prefix (returns to default one: '+client.config.prefix+')';
                embed.fields = [
                    {
                        name: 'note',
                        value: "After forgetting bot's prefix, just @Mention it in chat and it will respond to you with it's prefix for current server"
                    }
                ];
                if (message.args[1]) switch(message.args[1].toLowerCase()){
                    case "set":
                        if (!message.args[2]) throw 'You must specify the new config name!';
                        data.customprefix = message.args[2].toLowerCase();
                        await client.db.utils.replaceOne('guilds', {guildid: message.guild.id}, data);
                        embed.color = colors.success;
                        embed.author.name = 'Success!';
                        embed.description = `Successfully updated custom prefix for ${message.guild.name} to \`${data.customprefix}\``;
                        break;
                    case "reset":
                        data.customprefix = null;
                        await client.db.utils.replaceOne('guilds', {guildid: message.guild.id}, data);
                        embed.color = colors.success;
                        embed.author.name = 'Success!';
                        embed.description = `Successfully deleted custom prefix for **${message.guild.name}**\nBot will now react to default prefix: \`${client.config.prefix}\``;
                        break;
                    default:
                        break;
                    }
                    break;
                case "defaultrole":
                        embed.description = '`set <role_ID_or_@Role>` - changes default role to given value, can be either role id or directly @Mentioned'
                        +'\n`reset` - removes default role from configuration';
                    embed.fields = [
                        {
                            name: 'note',
                            value: "In order to work, it requires bot to have **MANAGE_ROLES** permission and the role has to be below bot's highest role"
                        }
                    ];
                    if (message.args[1]) switch(message.args[1].toLowerCase()){
                        case "set":
                            if (!message.guild.me.hasPermission('MANAGE_ROLES')) throw "I don't have **MANAGE_ROLES** permission here, so I can't use default role feature!";
                            if (!message.args[2]) throw "You must specify role's ID or @Mention it!";
                            if (!message.guild.roles.has(message.args[2])){
                                if (message.mentions.roles.size && message.args[2].includes(message.mentions.roles.first().id)){
                                    await updateRole(message.mentions.roles.first().id);
                                    break;
                                }
                                throw 'This is not a valid role ID nor @Mention!';
                            }
                            await updateRole(message.args[2]);
                            break;
                        case "reset":
                            data.defaultrole = null;
                            await client.db.utils.replaceOne('guilds', {guildid: message.guild.id}, data);
                            embed.color = colors.success;
                            embed.author.name = 'Success!';
                            embed.description = `Successfully deleted default role for **${message.guild.name}**`;
                            break;
                        default:
                            break;
                    }
                    break;
                case "leveling":
                    embed.description = '';
                    embed.fields = null;
                    if (message.args[1]) switch(message.args[1].toLowerCase()){
                        default:
                            break;
                    }
                    break;
                case "responses":
                    embed.description = '';
                    embed.fields = null;
                    if (message.args[1]) switch(message.args[1].toLowerCase()){
                        default:
                            break;
                    }
                    break;
                case "autorole":
                    embed.description = '';
                    embed.fields = null;
                    if (message.args[1]) switch(message.args[1].toLowerCase()){
                        default:
                            break;
                    }
                    break;
                case "logging":
                    embed.description = '';
                    embed.fields = null;
                    if (message.args[1]) switch(message.args[1].toLowerCase()){
                        default:
                            break;
                    }
                    break;
                default:
                    break;
            }
            embed.author.name = `${message.args[0].toLowerCase()} configuration, available options below`
            async function updateRole(roleID){
                if (message.guild.roles.get(roleID).calculatedPosition >= message.guild.me.highestRole.calculatedPosition) throw "I can't manage this role because of role hierarchy!";
                if (message.guild.roles.get(roleID).managed) throw "This role is a Discord integration role, it can't be managed!";
                if (roleID === message.guild.id) throw "Really clever, but setting `@everyone` role would not break me - you can't manage it!";
                data.defaultrole = roleID;
                await client.db.utils.replaceOne('guilds', {guildid: message.guild.id}, data);
                embed.color = colors.success;
                embed.author.name = 'Success!';
                embed.description = `Successfully updated default role for ${message.guild.name} to <@&${data.defaultrole}> (${data.defaultrole})`;
            }
        }
        message.channel.send({embed:embed});
    });
}