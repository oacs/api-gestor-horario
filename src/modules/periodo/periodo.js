
import { Router } from 'express';
import { db } from '../..';

const router = Router();

/** Obtengo todos los registros
 *
 */
router.get(`/`, function (req, res) {
    db.all(`select * from periodo`, (err, row) => {
        console.log(err);
        console.log(row);
        res.send(row);
    });
});

/**Obtengo un registro dado su id
 *
 */
router.get(`/:id`, function (req, res) {

    db.get(`select * from periodo where id =  ${req.params.id}`, (err, row) => {
        console.log(err);
        // console.log(row);
        res.send(row);
    });
});

/**Elimino un registro dado su id
 * @param id int
 */
router.delete(`/:id`, function (req, res) {

    db.get(`delete from periodo where id =  ${req.params.id}`, (err, row) => {
        console.log(err);
        // console.log(row);
        res.send(row);
    });
});

/** Actualizo un registro dado un id
 * @param id int
 * @body nombre text
 */
router.put(`/:id`, function (req, res) {

    db.run(`UPDATE periodo SET nombre = '${req.body.nombre}'  where id = ${req.params.id}`, (result, err) => {
        if (err) {
            console.log(err);
        } else {
            res.send({ msg: `Actualizado correctamente` })
        }
    });

});

/** Guardo un registro dado un id
 * @body nombre text
 */
router.post(`/`, function (req, res) {

    console.log(req.body);
    db.run(`insert into periodo(nombre) values ('${req.body.nombre}')`, info => {
        console.log(info);
        res.send(info);
    });
});

module.exports = router;
