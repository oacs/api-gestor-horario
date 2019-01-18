
import { Router } from 'express';
import { db } from '../..';

const router = Router();

/** Obtengo todos los registros
 *
 */
router.get(`/`, function (req, res) {
    db.all(`select * from periodo`, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send(row);
        }
    });
});

/**Obtengo un registro dado su id
 *
 */
router.get(`/:id`, function (req, res) {

    db.get(`select * from periodo where id =  ${req.params.id}`, (err, row) => {
        if (err) {
            res.send({err: err});
        } else {
            if (row == null) {
                res.status(404);
                res.send({ msg: 'Periodo no encontrado', status: -1})
            } else {

                res.send(row);
            }
        }
    });
});

/**Elimino un registro dado su id
 * @param id int
 */
router.delete(`/:id`, function (req, res) {

    db.get(`delete from periodo where id =  ${req.params.id}`, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send({ msg: `Actualizado correctamente`, status: 1  })
        }

    });
});

/** Actualizo un registro dado un id
 * @param id int
 * @body nombre text
 */
router.put(`/:id`, function (req, res) {

    db.run(`UPDATE periodo SET nombre = '${req.body.nombre}'  where id = ${req.params.id}`, (result, err) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send({ msg: `Actualizado correctamente`, status: 1  })
        }
    });

});

/** Guardo un registro dado un id
 * @body nombre text
 */
router.post(`/`, function (req, res) {

    console.log(req.body);
    db.run(`insert into periodo(nombre) values ('${req.body.nombre}')`, err => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send({ msg: `Agregado correctamente`, status: 1 })
        }
    });
});

module.exports = router;
