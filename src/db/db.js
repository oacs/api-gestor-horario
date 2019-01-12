const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('../../database.db', (err)=> {
    console.log(err);
});

export default db;