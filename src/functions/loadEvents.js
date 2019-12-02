module.exports = client => {
    loadEvents = function(){
        client.fs.readdir('./events', (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                let event = require(`../../events/${file}`);
                let eventName = file.split(".")[0];
                client.on(eventName, event.bind(null, client));
                delete require.cache[require.resolve(`../../events/${file}`)];
            });
        });
    }
    return loadEvents();
}