//added re-emiting log events for non-cached messages
module.exports = async (client, event) => {
    let handledEvents = {
        MESSAGE_UPDATE: 'messageUpdate',
        MESSAGE_DELETE: 'messageDelete'
    }
    if (!handledEvents.hasOwnProperty(event.t)) return;
    if (event.t === 'MESSAGE_UPDATE'){
        const { d: data } = event;
        let channel = client.channels.get(data.channel_id); //decided to get rid of DM channels as long as DMs are disabled in events/message.js (and also here)
        if (channel.type === "dm" || channel.messages.has(data.id)) return; //ignore DM channels and don't re-emit when message is already cached
    
        let newMessage = await channel.fetchMessage(data.id);
        client.emit(handledEvents[event.t], data, newMessage);
    }
    if (event.t === 'MESSAGE_DELETE'){
        const { d: data } = event;
        let channel = client.channels.get(data.channel_id);
        if (!channel) return; //getting rid of DMs(?)
        if (channel.messages.has(data.id)) return; //don't re-emit when message was already cached
        
        data.channel = channel;
        client.emit(handledEvents[event.t], data);
    }
}