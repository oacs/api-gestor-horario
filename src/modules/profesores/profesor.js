import { Router } from 'express';
import { db } from '../..';

const router = Router();

/**Obtengo todos los registros
 * 
 */
router.get(`/`, function (req, res) {
    db.all(`select * from profesor`, (err, row) => {
        if (err) {
            res.send({err: err});
        } else {
            res.send(row);
        }
    });
});

/**Busco dado su id
 * @param id int
 */
router.get(`/:id`, function (req, res) {

    db.get(`select * from profesor where id =  ${req.params.id}`, (err, row) => {
        if (err) {
            res.send({err: err});
        } else {
            res.send(row);
        }
    });
});
//TODO: enviar mensaje de status
/**Elimino dado su id
 * @param id int
 */
router.delete(`/:id`, function (req, res) {

    db.get(`delete from profesor where id =  ${req.params.id}`, (err, row) => {
        if (err) {
            res.send({err: err});
        } else {
            res.send(row);
        }
    });
});


//TODO: Rehacer
/**Actualiza dado su id
 * @param id int
 */

router.put(`/:id`, function (req, res) {
    if (req.body.nombre) {
        db.run(`UPDATE profesor SET nombre = $nombre WHERE id = $id`, {
            $id: req.params.id,
            $nombre: req.body.nombre
        }, info => {
            console.log(info);
            res.send(info);
        });
    }

    if (req.body.correo) {
        db.run(`UPDATE profesor SET correo = $correo WHERE id = $id`, {
            $id: req.params.id,
            $correo: req.body.correo
        }, info => {
            console.log(info);
            res.send(info);
        });
    }

    if (req.body.disp) {
        db.run(`UPDATE profesor SET disp = $disp WHERE id = $id`, {
            $id: req.params.id,
            $disp: req.body.disp
        }, info => {
            console.log(info);
            res.send(info);
        });
    }
});

router.post(`/`, function (req, res) {

    console.log(req.body);
    db.run(`insert into profesor(disp, nombre, correo)  values ('${req.body.disp}', '${req.body.nombre}', '${req.body.correo}')`, err => {
        if (err) {
            res.send({err: err});
        } else {
            res.send({ msg: `Agregado correctamente` })
        }
    });
});

router.get(`/horariosAnteriores/:id`, function (req, res) {

    db.get(`select horario, id_periodo from curso where id_profesor =  ${req.params.id}`, (err, row) => {
        if (err) {
            res.send({err: err});
        } else {
            res.send(row);
        }
    });
});

module.exports = router;
