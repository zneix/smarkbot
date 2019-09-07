module.exports = (thing, message, client) => {
    if (thing.startsWith('jd') || thing.startsWith('jp') || thing.startsWith('jebac') || thing.startsWith('jebać')) message.channel.send('jebać policję');
    if (thing === 'e') message.channel.send(client.emojis.find(e => e.name === "peepoHappyJAM").toString());
    if (thing === 'huj') message.channel.send(client.emojis.find(e => e.name === "forsenPls").toString());
    if (thing.includes('peppah')) message.channel.send(client.emojis.find(e => e.name === "WAYTOODANK")+" "+client.emojis.find(e => e.name === "WutFace"));
    if (thing.includes('aniki') || thing.includes('billy')) message.channel.send(client.emojis.find(e => e.name === "PepeHands").toString());
    if (thing.includes('nigger') || thing.includes('niger') || thing.includes('nigga')) message.channel.send(client.emojis.find(e => e.name === "cmonBruh").toString());
    if (thing.includes('sans')) message.channel.send('sans granie '+client.emojis.find(e => e.name === "gangsranie").toString());
}