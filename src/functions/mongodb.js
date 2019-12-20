let mongodb = require('mongodb');
let auth = require('../json/auth');
let uri = `mongodb+srv://${auth.db.user}:${auth.db.pass}@${auth.db.host}/smarkbot`;
let client = new mongodb.MongoClient(uri, {
	useUnifiedTopology: true,
	keepAlive: true,
	poolSize: 30,
	autoReconnect: true,
	socketTimeoutMS: 360000,
	connectTimeoutMS: 360000
});
let lvldb = 'smarkleveling'; //name of database with leveling info

//mongodb general utils
client.utils = new Object;
//reconnection
client.utils.reconnect = async function(){
    await client.close();
    return await client.connect().then(() => console.log('[mongodb] Reconeccted!')).catch(err => console.log(`[!mongodb] Error while reconnecting:\n${err}`));
}
//terminating current connection
client.utils.close = async function close(){
    return await client.close().then(() => console.log('[mongodb] Closed connection!')).catch(err => console.log(`[!mongodb] Error while closing connection:\n${err}`));
}
//logging into
client.utils.connect = async function(){
    return await client.connect().then(() => console.log('[mongodb] Connected!')).catch(err => console.log(`[!mongodb] Error while connecting:\n${err}`));
}
//finding documents
client.utils.find = async function(collectionName, filter){
	if (!collectionName) return "collection name can't be null";
	return await client.db().collection(collectionName).find(filter).toArray();
}
//inserting documents
client.utils.insert = async function(collectionName, docs){
	if (!collectionName) return "collection name can't be null";
	return await client.db().collection(collectionName).insertMany(docs);
}
//updating single document
client.utils.replaceOne = async function(collectionName, filter, doc){
    if (!collectionName) return "collection name can't be null";
    return await client.db().collection(collectionName).findOneAndReplace(filter, doc);
}
//deleting documents
client.utils.delete = async function(collectionName, filter){
	if (!collectionName) return "collection name can't be null";
	return await client.db().collection(collectionName).deleteMany(filter);
}
//new config template insertion
client.utils.newGuildConfig = async function(guildid){
	let template = {
		guildid: guildid,
		customprefix: null,
		defaultrole: null,
		modrole: null,
		adminrole: null,
		modules: {
			leveling: {
				enabled: false,
				announcetype: 'embed',
				blacklist: [],
				blocked: [],
				rewards: {}
			},
			responses: {
				enabled: false
			},
			roles: {
				enabled: false,
				units: {}
			},
			logging: {
				enabled: false,
				joinleave: null,
				message: null
			}
		}
	}
	return await client.db().collection('guilds').insertOne(template);
}

//mongodb leveling module utils
client.lvl = new Object;
//getting user level info
client.lvl.findUser = async function(guildid, userid){
	return await client.db('smarkleveling').collection(guildid).find({userid: userid}).toArray();
}
client.lvl.updateUser = async function(guildid, D_OMEGALUL_C){
	return await client.db('smarkleveling').collection(guildid).findOneAndReplace({userid: D_OMEGALUL_C.userid}, D_OMEGALUL_C);
}
//new user level info insertion
client.lvl.newUser = async function(guildid, userid){
	(await client.db('smarkleveling').listCollections().toArray()).some(x => x.name === guildid)?null:(await client.db('smarkleveling').createCollection(guildid));
	let template = {
		userid: userid,
		lvl: 0,
		xp: 0
	}
	return (await client.db('smarkleveling').collection(guildid).insertOne(template)).ops[0];
}
//finding and sorting elements in leveling collection
client.lvl.getLeaderboard = async function(guildid){
	return await client.db('smarkleveling').collection(guildid).find().sort('xp', -1).toArray();
}
//getting user positions and doc count for rank.js command
client.lvl.getRanking = async function(guildid, userid){
	let all = await client.db('smarkleveling').collection(guildid).countDocuments();
	let userArr = (await client.db('smarkleveling').collection(guildid).find({}, {projection: {userid: userid, _id: null}}).sort('xp', -1).toArray());
	for (i=0;i<userArr.length;i++) if (userArr[i].userid == userid) return (i+1)+'/'+all;
}

//mongodb-related listeners for topology and failed heartbeats information
client.on('serverHeartbeatFailed', function(event){
	console.log('[mongodb:event] Heartbeat FAILED!');
});
client.on('topologyOpening', function(event){
	console.log('[mongodb:event] Server topology is OPENING!');
});
client.on('topologyClosed', function(event){
	console.log('[mongodb:event] Server topology is CLOSING!');
});

//process listeners for database disconnecting once process terminates
process.on('SIGINT', async () => {
	await client.close().then(() => console.log('[mongodb] Closed upon SIGINT!'));
	process.exit();
});
process.on('exit', code => console.log('[node] Process exited with code '+code));

module.exports = client;