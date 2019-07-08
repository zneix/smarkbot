module.exports = (client) => {
    console.log(`Imma ready HYPERS!\nLogged in as: '${client.user.tag}'`);
    client.user.setPresence({status: 'idle', game: {name: `thot slayer 3k`, type: 'PLAYING'}});
    console.log(`\nConnected to WebSocket, executing regular work!\n===============================================`);
}