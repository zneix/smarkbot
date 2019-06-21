module.exports = bot => {
    console.log(`Imma ready HYPERS!\nLogged in as: '${bot.user.tag}'`);
    bot.user.setPresence({status: 'idle', game: {name: `thot slayer 3k`, type: 'PLAYING'}});
    console.log(`\nConnected to WebSocket, executing regular work!\n===============================================`);
}