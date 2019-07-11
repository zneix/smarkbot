module.exports = Promise => {
    const obj = {
        db: {
            host: process.env.dbhost,
            user: process.env.dbuser,
            password: process.env.dbpassword,
            database: process.env.dbdatabase,
            Promise: Promise
        },
        token: process.env.token
    }
    return obj;
}