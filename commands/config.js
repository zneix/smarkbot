exports.name = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.description = `Changes bot configuration for current server.`;
exports.usage = `{PREFIX}${__filename.split(/[\\/]/).pop().slice(0,-3)}`;
exports.perms = 'admin';
exports.home = false;

exports.run = async (client, message) => {
    message.command(false, async () => {
        let data = (await client.db.utils.find('guilds', {guildid: message.guild.id}))[0];
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
            +'\n`roles` - manages system of automatic role assignment via command'
            +'\n`logging` - manages logging system',
            // +'\n`resetall` - reverts all the config settings to default ones',
            fields: [
                {
                    name: 'current brief config',
                    value:
                    `prefix - ${data.customprefix?data.customprefix:(`${client.config.prefix} (default)`)}`
                    +`\ndefaultrole - ${data.defaultrole?`<@&${data.defaultrole}> (${data.defaultrole})`:'none'}`
                    +`\nleveling - ${data.modules.leveling.enabled?'**enabled**':'disabled'}, ${Object.getOwnPropertyNames(data.modules.leveling.rewards).length} rewards; level-ups: ${data.modules.leveling.announcetype}`
                    +`\nresponses - ${data.modules.responses.enabled?'**enabled**':'disabled'}`
                    +`\nroles - ${data.modules.roles.enabled?'**enabled**':'disabled'}, ${Object.getOwnPropertyNames(data.modules.roles.units).length} configured role(s)`
                    +`\nlogging - ${data.modules.logging.enabled?'**enabled**':'disabled'}, join/leave: ${data.modules.logging.joinleave?`<#${data.modules.logging.joinleave}>`:'none'}, message: ${data.modules.logging.message?`<#${data.modules.logging.message}>`:'none'}`
                }
            ]
        }
        if (message.args.length) {
            embed.author.name = `${message.args[0].toLowerCase()} configuration, available options below`;
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
                        if (!message.args[2]) throw 'You must specify the new prefix!';
                        data.customprefix = message.args[2].toLowerCase();
                        await updateConfig(`Successfully updated custom prefix for **${message.guild.name}** to \`${data.customprefix}\``);
                        break;
                    case "reset":
                    case "clear":
                        data.customprefix = null;
                        await updateConfig(`Successfully deleted custom prefix for **${message.guild.name}**\nBot will now react to default prefix: \`${client.config.prefix}\``, null);
                        break;
                    default:
                        break;
                    }
                    break;
                case "defaultrole":
                        embed.description = '`set <ID_or_@Role>` - changes default role to given value, can be either role ID or direct role @Mention'
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
                        case "clear":
                            data.defaultrole = null;
                            await updateConfig(`Successfully deleted default role for **${message.guild.name}**`, null);
                            break;
                        default:
                            break;
                    }
                    break;
                case "leveling":
                    embed.description = '`enable / disable` - toggles whole module'
                    +'\n`type` - type of announcing level-up: embed, react, dm, none'
                    +'\n`blacklist` - manages channel blacklist'
                    +'\n`block` - manages list of users excluded from leveling'
                    +'\n`rewards` - manages role rewards';
                    embed.fields = [
                        {
                            name: 'note',
                            value: 'use one of above options to get more help' //finish note
                        }
                    ];
                    if (message.args[1]) switch(message.args[1].toLowerCase()){
                        case "enable":
                        case "true":
                            data.modules.leveling.enabled = true;
                            await updateConfig(`Leveling system is now __**enabled**__ in **${message.guild.name}**!`, null);
                            break;
                        case "disable":
                        case "false":
                            data.modules.leveling.enabled = false;
                            await updateConfig(`Leveling system is now __**disabled**__ in **${message.guild.name}**!`, null);
                            break;
                        case "type":
                                embed.description = '`embed` - shows level-up embed messages in current channel'
                                +'\n`react` - type of announcing level-up: embed, react, dm, none'
                                +'\n`dm` - sends level-up message directly to the user'
                                +'\n`none` - completely disables announcing level-ups'
                                embed.fields[0].value = `This option changes default bot's behavoir when someone levels up\nCurrent setting: \`${data.modules.leveling.announcetype}\``;
                                if (message.args[2]) switch(message.args[2].toLowerCase()){
                                    case "embed":
                                        data.modules.leveling.announcetype = 'embed';
                                        await updateConfig(`Changed type of level up announces to __embed messages__`, null);
                                        break;
                                    case "react":
                                        data.modules.leveling.announcetype = 'react';
                                        await updateConfig(`Changed type of level up announces to __reactions__`, null);
                                        break;
                                    case "dm":
                                        data.modules.leveling.announcetype = 'dm';
                                        await updateConfig(`Changed type of level up announces to __direct messages__`, null);
                                        break;
                                    case "none":
                                        data.modules.leveling.announcetype = 'none';
                                        await updateConfig(`__Disabled__ level up announces completely`, null);
                                        break;
                                    default:
                                        break;
                                }
                            break;
                        case "blacklist":
                            embed.description = '`add <ID_or_#Channel>` - adds specified channel to blacklist'
                            +'\n`remove <ID_or_#Channel>` - removes specified channel from blacklist'
                            +'\n`clear` - clears blacklist restriction';
                            let blacklist = [];
                            data.modules.leveling.blacklist.forEach(chid => blacklist.push(`<#${chid}>`));
                            embed.fields[0].name = `Current list of channels that are excluded from getting xp in them [${data.modules.leveling.blacklist.length}]`;
                            embed.fields[0].value = blacklist.length?blacklist.join('\n'):'There are no blacklisted channels.';
                            if (message.args[2]) switch(message.args[2].toLowerCase()){
                                case "add":
                                    if (!message.args[3]) throw 'You must specify Channel ID or mention it via #Channel';
                                    if (message.mentions.channels.size) {
                                        if (message.guild.channels.has(message.mentions.channels.first().id) && message.args[3].includes(message.mentions.channels.first().id)){
                                            //success from mention
                                            data.modules.leveling.blacklist.push(message.mentions.channels.first().id);
                                            await updateConfig(`Channel <#${message.mentions.channels.first().id}> (${message.mentions.channels.first().id}) has been __added__ to blacklist.`, null);
                                            break;
                                        }
                                        throw 'Mentioned channel is not a part of current server!';
                                    }
                                    if (!message.guild.channels.has(message.args[3])) throw "Channel with given ID is not a part of current server!";
                                    //success from ID
                                    data.modules.leveling.blacklist.push(message.args[3]);
                                    await updateConfig(`Channel <#${message.args[3]}> (${message.args[3]}) has been __added__ to blacklist.`, null);
                                    break;
                                case "remove":
                                    if (!message.args[3]) throw 'You must specify Channel ID or mention it via #Channel';
                                    if (message.mentions.channels.size) {
                                        if (message.guild.channels.has(message.mentions.channels.first().id) && message.args[3].includes(message.mentions.channels.first().id)){
                                            //success from mention
                                            let index = data.modules.leveling.blacklist.indexOf(message.mentions.channels.first().id);
                                            if (index > -1) data.modules.leveling.blacklist.splice(index, 1);
                                            await updateConfig(`Channel <#${message.mentions.channels.first().id}> (${message.mentions.channels.first().id}) has been __removed__ from blacklist.`, null);
                                            break;
                                        }
                                        throw 'Mentioned channel is not a part of current server!';
                                    }
                                    if (!message.guild.channels.has(message.args[3])) throw "Channel with given ID is not a part of current server!";
                                    //success from ID
                                    let index = data.modules.leveling.blacklist.indexOf(message.args[3]);
                                    if (index > -1) data.modules.leveling.blacklist.splice(index, 1);
                                    await updateConfig(`Channel <#${message.args[3]}> (${message.args[3]}) has been __removed__ from blacklist.`, null);
                                    break;
                                case "reset":
                                case "clear":
                                    data.modules.leveling.blacklist = [];
                                    await updateConfig(`Blacklist for **${message.guild.name}** has been cleared`, [{name:'note',value:'xp will be now granted for chatting in every channel, even spammy command ones'}]);
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "block":
                            embed.description = '`add <ID_or_@Mention>` - adds specified user to blocked'
                            +'\n`remove <ID_or_@Mention>` - removes specified user from blocked'
                            +'\n`clear` - clears blocked restriction';
                            let blocked = [];
                            data.modules.leveling.blocked.forEach(chid => blocked.push(`<@${chid}>`));
                            embed.fields[0].name = `Current list of users that are excluded from getting xp`;
                            embed.fields[0].value = blocked.length?blocked.join('\n'):'There are no blocked users.';
                            if (message.args[2]) switch (message.args[2].toLowerCase()){
                                case "add":
                                    if (!message.args[3]) throw 'You must specify user by their ID or @Mention it!';
                                    if (message.mentions.members.size) {
                                        if (message.guild.members.has(message.mentions.members.first().id) && message.args[3].includes(message.mentions.members.first().id)){
                                            //success from mention
                                            data.modules.leveling.blocked.push(message.mentions.members.first().id);
                                            await updateConfig(`User <@${message.mentions.members.first().id}> (${message.mentions.members.first().id}) has been blocked from getting xp.`, null);
                                            break;
                                        }
                                        throw 'Mentioned user is not a part of current server!';
                                    }
                                    if (!message.guild.members.has(message.args[3])) throw 'User with given ID is not a part of current server!';
                                    //success from ID
                                    data.modules.leveling.blocked.push(message.args[3]);
                                    await updateConfig(`User <@${message.args[3]}> (${message.args[3]}) has been blocked from getting xp.`, null);
                                    break;
                                case "remove":
                                    if (!message.args[3]) throw 'You must specify User ID or @Mention it!';
                                    if (message.mentions.members.size) {
                                        if (message.guild.members.has(message.mentions.members.first().id) && message.args[3].includes(message.mentions.members.first().id)){
                                            //success from mention
                                            let index = data.modules.leveling.blocked.indexOf(message.mentions.members.first().id);
                                            if (index > -1) data.modules.leveling.blocked.splice(index, 1);
                                            await updateConfig(`User <@${message.mentions.members.first().id}> (${message.mentions.members.first().id}) has been unblocked.`, null);
                                            break;
                                        }
                                        throw 'Mentioned user is not a part of current server!';
                                    }
                                    if (!message.guild.members.has(message.args[3])) throw 'User with given ID is not a part of current server!';
                                    //success from ID
                                    let index = data.modules.leveling.blocked.indexOf(message.args[3]);
                                    if (index > -1) data.modules.leveling.blocked.splice(index, 1);
                                    await updateConfig(`User <@${message.args[3]}> (${message.args[3]}) has been unblocked.`, null);
                                    break;
                                case "reset":
                                case "clear":
                                    data.modules.leveling.blocked = [];
                                    await updateConfig(`Cleared user restriction for **${message.guild.name}**`, [{name:'note',value:'xp will be now granted for every single user except for bots'}]);
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "rewards":
                            embed.description = '`add <level> <ID_or_@Mention>` - adds specified reward'
                            +'\n`remove <level> <ID_or_@Mention>` - removes specified reward'
                            +'\n`reset` - removes all the rewards';
                            embed.fields[0].name = 'Currently configured rewards';
                            let rewArr = [];
                            let rewardLevels = Object.getOwnPropertyNames(data.modules.leveling.rewards);
                            if (rewardLevels.length){
                                let n = Math.max.apply(Math, rewardLevels);
                                for (i=0;i<=n;i++){
                                    if (rewardLevels.includes(i.toString())) {
                                        let subRewArr = [];
                                        subRewArr.push(`Level ${i}: `);
                                        rewardLevels.forEach(level => {
                                            if (level == i) subRewArr.push(`<@&${data.modules.leveling.rewards[level]}> (${data.modules.leveling.rewards[level]})`);
                                        });
                                        rewArr.push(subRewArr.join(' '));
                                    }
                                }
                                embed.fields[0].value = rewArr.join('\n').length<1020?rewArr.join('\n'):rewArr.join('\n').substr(0, 1012).concat(' [truncated]');
                            }
                            else embed.fields[0].value = 'There are no rewards configured.';
                            //further configuration
                            if (message.args[2]) switch(message.args[2].toLowerCase()){
                                case "add":
                                    embed.fields = null;
                                    if (!message.guild.me.hasPermission('MANAGE_ROLES')) throw "I don't have **MANAGE_ROLES** permission here, so I can't use reward system here!";
                                    if (!message.args[3] || !message.args[4]) throw 'You must specify both level __and__ role by its ID or direct @Mention';
                                    if (!Number.isInteger(parseInt(message.args[3])) || !(/\d+/.test(message.args[3]))) throw `\`${message.args[3]}\` is not a valid positive number`;
                                    if (message.args[3] > 200) throw 'Bot supports level rewards can not be set above level 200!';
                                    if (!message.guild.roles.has(message.args[4])){
                                        if (message.mentions.roles.size && message.args[4].includes(message.mentions.roles.first().id)){
                                            data.modules.leveling.rewards[message.args[3]] = message.mentions.roles.first().id;
                                            await updateRole(message.mentions.roles.first().id, {added: true, lvl: message.args[3]});
                                            break;
                                        }
                                        throw 'This is not a valid role ID nor @Mention!';
                                    }
                                    data.modules.leveling.rewards[message.args[3]] = message.args[4];
                                    await updateRole(message.args[4], {added: true, lvl: message.args[3]});
                                    break;
                                case "remove":
                                    embed.fields = null;
                                    if (!message.guild.me.hasPermission('MANAGE_ROLES')) throw "I don't have **MANAGE_ROLES** permission here, so I can't use reward system here!";
                                    if (!message.args[3] || !message.args[4]) throw 'You must specify both level __and__ role by its ID or direct @Mention';
                                    if (!Number.isInteger(parseInt(message.args[3])) || !(/\d+/.test(message.args[3]))) throw `\`${message.args[3]}\` is not a valid positive number`;
                                    if (message.args[3] > 200) throw 'Bot supports level rewards can not be set above level 200!';
                                    if (!message.guild.roles.has(message.args[4])){
                                        if (message.mentions.roles.size && message.args[4].includes(message.mentions.roles.first().id)){
                                            delete data.modules.leveling.rewards[message.args[3]];
                                            await updateRole(message.mentions.roles.first().id, {added: false, lvl: message.args[3]});
                                            break;
                                        }
                                        throw 'This is not a valid role ID nor @Mention!';
                                    }
                                    delete data.modules.leveling.rewards[message.args[3]];
                                    await updateRole(message.args[4], {added: false, lvl: message.args[3]});
                                    break;
                                case "reset":
                                case "clear":
                                    embed.fields = null;
                                    data.modules.leveling.rewards = {};
                                    await updateConfig(`Cleared all role rewards for **${message.guild.name}**`, null);
                                    break;
                                default:
                                    break;
                                }
                            break;
                        default:
                            break;
                    }
                    break;
                case "responses":
                    embed.description = '`enable / disable` - toggles whole module'
                    embed.fields[0].name = 'Current Setting';
                    embed.fields[0].value = data.modules.responses.enabled?'Enabled':'Disabled';
                    if (message.args[1]) switch(message.args[1].toLowerCase()){
                        case "enable":
                        case "true":
                            data.modules.responses.enabled = true;
                            await updateConfig(`Responses module is now __enabled__.`, null);
                            break;
                        case "disable":
                        case "false":
                            data.modules.responses.enabled = false;
                            await updateConfig(`Responses module is now __disabled__.`, null);
                            break;
                        default:
                            break;
                    }
                    break;
                case "roles":
                    embed.description = '`enable / disable` - toggles whole module'
                    +'\n`add <name> <roleID_or_@Role>` - adds a new role to module'
                    +'\n`remove <name>` - removes existing role from module'
                    +'\n`clear` - removes all roles from the module';
                    embed.fields[0].name = 'Currently configured roles';
                    let currRoles = '';
                    if (Object.getOwnPropertyNames(data.modules.roles.units).length){
                        for (i=0;i<Object.getOwnPropertyNames(data.modules.roles.units).length;i++){
                            currRoles = currRoles.concat(`${Object.getOwnPropertyNames(data.modules.roles.units)[i]}: <@&${data.modules.roles.units[Object.getOwnPropertyNames(data.modules.roles.units)[i]]}>\n`);
                        }
                    }
                    else currRoles = 'No configured roles.';
                    currRoles = ('Module is '+(data.modules.roles.enabled?'**enabled**':'disabled'))+'\n'+currRoles;
                    embed.fields[0].value = currRoles;
                    if (message.args[1]) switch(message.args[1].toLowerCase()){
                        case "enable":
                        case "true":
                            data.modules.roles.enabled = true;
                            await updateConfig(`Roles module is now __enabled__`, null);
                            break;
                        case "disable":
                        case "false":
                            data.modules.roles.enabled = false;
                            await updateConfig(`Roles module is now __disabled__`, null);
                            break;
                        case "add":
                            if (!message.guild.me.hasPermission('MANAGE_ROLES')) throw "I don't have **MANAGE_ROLES** permission here, so I can't use role assignment feature!";
                            if (!message.args[2] || !message.args[3]) throw 'You must specify **name for assignment** and **role ID/@Mention**';
                            if (!message.guild.roles.has(message.args[3])){
                                if (message.mentions.roles.size && message.args[3].includes(message.mentions.roles.first().id)){
                                    data.modules.roles.units[message.args[2]] = message.mentions.roles.first().id;
                                    roleCheck(message.mentions.roles.first().id);
                                    await updateConfig(`Successfully added role ${message.mentions.roles.first()} to autoassignment module with name \`${message.args[2]}\``, null);
                                    break;
                                }
                                throw 'This is not a valid role ID nor @Mention!';
                            }
                            data.modules.roles.units[message.args[2]] = message.args[3];
                            roleCheck(message.args[3]);
                            await updateConfig(`Successfully added role <@&${message.args[3]}> to autoassignment module with name \`${message.args[2]}\``, null);
                            break;
                        case "remove":
                            if (!message.args[2]) throw "You must specify the **role assignment name**";
                            if (!data.modules.roles.units[message.args[2]]) throw "That role doesn't exist in autoassignment module";
                            delete data.modules.roles.units[message.args[2]];
                            await updateConfig(`Removed role associated with name \`${message.args[2]}\` from autoassignment module`, null);
                            break;
                        case "clear":
                            data.modules.roles.units = {};
                            await updateConfig(`All roles has been excluded from autoassigning`, null);
                            break;
                        default:
                            break;
                    }
                    break;
                case "logging":
                    embed.description = '`enable / disable` - toggles whole module'
                    +'\n`joinleave` - sets new log channel for join/leave and ban/unban events'
                    +'\n`message` - sets new log channel for message edits/deletions'
                    embed.fields[0].name = 'Currently configured log channels';
                    embed.fields[0].value = (data.modules.logging.enabled?'**Enabled**':'Disabled')
                    +`\nJoin / Leave log channel: ${data.modules.logging.joinleave?`<#${data.modules.logging.joinleave}> (${data.modules.logging.joinleave})`:' null'}`
                    +`\nMessage log channel: ${data.modules.logging.message?`<#${data.modules.logging.message}> (${data.modules.logging.message})`:' null'}`;
                    if (message.args[1]) switch(message.args[1].toLowerCase()){
                        case "enable":
                        case "true":
                            data.modules.logging.enabled = true;
                            await updateConfig('Logging module is now __enabled__', null);
                            break;
                        case "disable":
                        case "false":
                            data.modules.logging.enabled = false;
                            await updateConfig('Logging module is now __disabled__', null);
                            break;
                        case "joinleave":
                            embed.description = '`set <channelID_or_#Channel>` - sets new Join/leave channel'
                            +'\n`clear` - deletes Join/leave logging channel';
                            embed.fields[0].name = 'Current setting';
                            embed.fields[0].value = (data.modules.logging.joinleave?`<#${data.modules.logging.joinleave}>`:'null');
                            if (message.args[2]){
                                switch(message.args[2].toLowerCase()){
                                    case "set":
                                        if (!message.args[3]) throw 'You must specify Join/leave log channel to set!';
                                        if (!message.guild.channels.get(message.args[3])){
                                            if (message.mentions.channels.size){
                                                if (message.guild.channels.has(message.mentions.channels.first().id)){
                                                    if (message.mentions.channels.first().type !== 'text') throw 'This is not a text channel!';
                                                    data.modules.logging.joinleave = message.mentions.channels.first().id;
                                                    await updateConfig(`<#${message.mentions.channels.first().id}> is now Join/leave log channel`, null);
                                                    break;
                                                }
                                            }
                                            throw 'Mentioned channel is not a part of current server!';
                                        }
                                        else {
                                            if (message.guild.channels.get(message.args[3]).type !== 'text') throw 'This is not a text channel!';
                                            data.modules.logging.joinleave = message.args[3];
                                            await updateConfig(`<#${message.args[3]}> is now Join/leave log channel`, null);
                                        }
                                        break;
                                    case "clear":
                                        data.modules.logging.joinleave = null;
                                        await updateConfig(`Deleted Join/leave channel from config`, null);
                                        break;
                                    default:
                                        break;
                                }
                            }
                            break;
                        case "message":
                            embed.description = '`set <channelID_or_#Channel>` - sets new message channel'
                            +'\n`clear` - deletes message logging channel';
                            embed.fields[0].name = 'Current setting';
                            embed.fields[0].value = data.modules.logging.message?`<#${data.modules.logging.message}>`:'null';
                            if (message.args[2]){
                                switch(message.args[2].toLowerCase()){
                                    case "set":
                                        if (!message.args[3]) throw 'You must specify message log channel to set!';
                                        if (!message.guild.channels.get(message.args[3])){
                                            if (message.mentions.channels.size){
                                                if (message.guild.channels.has(message.mentions.channels.first().id)){
                                                    if (message.mentions.channels.first().type !== 'text') throw 'This is not a text channel!';
                                                    data.modules.logging.message = message.mentions.channels.first().id;
                                                    await updateConfig(`<#${message.mentions.channels.first().id}> is now message log channel`, null);
                                                    break;
                                                }
                                            }
                                            throw 'Mentioned channel is not a part of current server!';
                                        }
                                        else {
                                            if (message.guild.channels.get(message.args[3]).type !== 'text') throw 'This is not a text channel!';
                                            data.modules.logging.message = message.args[3];
                                            await updateConfig(`<#${message.args[3]}> is now message log channel`, null);
                                        }
                                        break;
                                    case "clear":
                                        data.modules.logging.message = null;
                                        await updateConfig(`Deleted message channel from config`, null);
                                        break;
                                    default:
                                        break;
                                }
                            }
                            break;
                        default:
                            break;
                    }
                    break;
                // case "resetall":
                //     await client.db.utils.delete('guilds', message.guild.id);
                //     await client.db.utils.newGuildConfig(message.guild.id);
                //     embed.color = colors.success;
                //     embed.author.name = 'Success!';
                //     embed.description = 'Reverted all config settings to defaults';
                //     embed.fields = null;
                //     break;
                default:
                    break;
            }
            function roleCheck(role){
                if (message.guild.roles.get(role).calculatedPosition >= message.guild.me.highestRole.calculatedPosition) throw "I can't manage this role because of role hierarchy!";
                if (message.guild.roles.get(role).managed) throw "This role is a Discord integration role, it can't be managed!";
                if (role === message.guild.id) throw "Really clever, but setting `@everyone` role would not break me - you can't manage it!";
            }
            async function updateRole(roleID, reward){
                roleCheck(roleID);
                if (!reward) data.defaultrole = roleID;
                await updateConfig(reward?`Successfully __${reward.added?'added':'removed'}__ reward <@&${roleID}> (${roleID}) for level __${reward.lvl}__`:`Successfully updated default role for **${message.guild.name}** to <@&${data.defaultrole}> (${data.defaultrole})`);
            }
            async function updateConfig(msg, fields){
                await client.db.utils.replaceOne('guilds', {guildid: message.guild.id}, data);
                embed.color = colors.success;
                embed.author.name = 'Success!';
                embed.description = msg;
                if (fields || fields === null) embed.fields = fields;
            }
        }
        message.channel.send({embed:embed});
    });
}