module.exports = client => {
    loadCommands = function(){
        client.fs.readdir('./commands', (err, files) => {
            if (err) return console.error(err);
            files.forEach(file => {
                if (!file.endsWith(".js")) return;
                let props = require(`../../commands/${file}`);
                let name = file.split(".")[0];
                console.log(`Attempting to load command ${name}`);
                client.commands.set(name, props);
            });
            console.log(`\nCommands loaded, preparing to auth the WebSocket!\n=================================================`);
        });
    }
    return loadCommands();
}