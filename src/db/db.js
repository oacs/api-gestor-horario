const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('database.db', (err)=> {
    console.log('error de conexion con bd');
    console.log(err);
});
// db.all('select * from main.materia;', (err, row) => {
//     console.log(err);
//     console.log(row);
// });

export default db;