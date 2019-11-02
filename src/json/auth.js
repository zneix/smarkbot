const obj = {
    db: {
        host: process.env.dbhost,
        user: process.env.dbuser,
        pass: process.env.dbpass,
    },
    token: process.env.token
}
module.exports = obj;