let perms = require('../json/perms.json'); //import, because getting client let would be pain
exports.unbanned = function(guild, user){
    if (perms["hardban"].includes(user.id)) keep(guild, user);
}

exports.joined = function(member){
    if (perms["hardban"].includes(member.user.id)) keep(member.guild, member.user);
}

function keep(guild, user){
    guild.ban(user.id, "This user is hardbanned, you can't unban them manually.");
}