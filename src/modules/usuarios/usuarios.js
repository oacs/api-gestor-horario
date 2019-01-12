import db from '../../db/db';
import { Router } from 'express';

const router = Router();

/**Obtengo todos los registros
 * 
 */
router.get('/', function (req, res) {
    db.all('select * from profesor', (err, row) => {
        console.log(err);
        console.log(row);
        res.send(row);
    });
});

/**Busco dado su id
 * @param id int
 */
router.get('/:id', function (req, res) {

    db.get('select * from profesor where id = ' + req.params.id, (err, row) => {
        console.log(err);
        console.log(row);
        res.send(row);
    });
});
/**Elimino dado su id
 * @param id int
 */
router.delete('/:id', function (req, res) {

    db.get('delete from profesor where id = ' + req.params.id, (err, row) => {
        console.log(err);
        console.log(row);
        res.send(row);
    });
});

//TODO: implementar función getBy

//TODO: Modificar esta función para que quede igual a las demás
router.put('/:id', function (req, res) {
    if (req.body.nombre) {
        db.run('UPDATE profesor SET nombre = $nombre WHERE id = $id', {
            $id: req.params.id,
            $nombre: req.body.nombre
        }, info => {
            console.log(info);
            res.send(info);
        });
    }

    if (req.body.correo) {
        db.run('UPDATE profesor SET correo = $correo WHERE id = $id', {
            $id: req.params.id,
            $correo: req.body.correo
        }, info => {
            console.log(info);
            res.send(info);
        });
    }

    if (req.body.disp) {
        db.run('UPDATE profesor SET disp = $disp WHERE id = $id', {
            $id: req.params.id,
            $nombre: req.body.disp
        }, info => {
            console.log(info);
            res.send(info);
        });
    }
});

router.post('/', function (req, res) {

    console.log(req.body);
    db.run('insert into profesor(disp, nombre, correo)  values $disp, $nombre, $correo)', {
        $disp: req.body.disp,
        $nombre: req.body.nombre,
        $correo: req.body.correo
    }, info => {
        console.log(info);
        res.send(info);
    });
});

module.exports = router;
