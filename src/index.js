import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import con from './db/db';
import morgan from 'morgan';

import curso from  './modules/cursos/curso'
import materia_x_pensum from  './modules/materias/materia_x_pensum'
import materia from  './modules/materias/materia'
import pensum from  './modules/pensum/pensum'
import profesor from './modules/profesores/profesor'

export const db = con;
// Get env settings
dotenv.config();

let app = express();

app.use(morgan('dev'))

app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', (req, res) => res.send('Hello Wssodrld4d3!'));
app.use('/curso', curso);
app.use('/materia_x_pensum', materia_x_pensum);
app.use('/materia', materia);
app.use('/pensum', pensum);
app.use('/profesores', profesor);

app.listen(3005, () => {
    console.log('server started - 3005');
});   
