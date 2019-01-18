import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import con from './db/db';
import cors from 'cors';
import morgan from 'morgan';

import usuarios from './modules/usuarios/usuarios'

// Get env settings
dotenv.config();

let app = express();

app.use(morgan('dev'))
app.use(cors());
app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', (req, res) => res.send('Hello Wssodrld4d3!'));
app.use('/usuario', usuarios);

app.listen(3005, () => {
    console.log('server started - 3005');
});