import {
    Router
} from 'express';
import {
    db
} from '../..';

const router = Router();

/** Obtengo todos los registros
 *
 */
router.get(`/`, function (req, res) {
    db.all(`select * from materia`, (err, row) => {
        if (err) {
            res.send({
                err: err,
                status: -1
            });
        } else {
            res.send(row);
        }
    });
});

/**Obtengo un registro dado su id
 *
 */
router.get(`/:id`, function (req, res) {

    db.get(`select * from materia where id =  ${req.params.id}`, (err, row) => {
        if (err) {
            res.send({
                err: err,
                status: -1
            });
        } else {
            res.send(row);
        }
    });
});

/**Elimino un registro dado su id
 * @param id int
 */
router.delete(`/:id`, function (req, res) {

    db.get(`delete from materia where id =  ${req.params.id}`, (err, row) => {
        if (err) {
            res.send({
                err: err,
                status: -1
            });
        } else {
            res.send({
                msg: `Registro eliminado correctamente`
            });
        }
    });
});

/** Actualizo un registro dado un id
 * @param id int
 * @body nombre text
 */
router.put(`/:id`, function (req, res) {
    if (req.body.nombre) {
        db.run(`UPDATE materia SET nombre = $nombre WHERE id = $id`, {
            $id: req.params.id,
            $nombre: req.body.nombre
        }, (err, row) => {
            if (err) {
                res.send({
                    err: err,
                    status: -1
                });
            } else {
                res.send({
                    msg: `Registro actualizado correctamente`,
                    status: 1
                });
            }
        });
    }

});

/** Guardo un registro dado un id
 * @body nombre text
 */
router.post(`/`, function (req, res) {

    console.log(req.body);
    db.run(`insert into materia(nombre)  values ('${req.body.nombre}')`, (err, row2) => {
        if (err) {
            res.send({
                err: err,
                status: -1
            });
        } else {
            db.get(`select id from materia order by id DESC limit 1;`, (err, row) => {
                if (err) {
                    res.send({
                        err: err,
                        status: -1
                    });
                } else {
                    res.send(row);
                }
            })
        }
    });
});

/**Obtengo todas las materias que prelan a una materia dada
 *
 */
router.get(`/:id/:id_pensum/prelantes`, function (req, res) {
    console.log(req.params.id);
    db.all(`SELECT
    materia_x_pensum.id_pensum,
    materia_x_pensum.horas,
    materia_x_pensum.maxH,
    materia_x_pensum.semestre,
    materia.nombre,
    prelacion.id_prelada,
    prelacion.id_prelante,
    prelacion.tipo
    FROM
    materia_x_pensum
    INNER JOIN materia ON materia_x_pensum.id_materia = materia.id
    INNER JOIN prelacion ON prelacion.id_prelante = materia_x_pensum.id_materia AND prelacion.id_pensum = materia_x_pensum.id_pensum AND prelacion.id_pensum = materia_x_pensum.id_pensum
    WHERE
prelacion.id_prelada = ${req.params.id} and prelacion.id_pensum = ${req.params.id_pensum}  `, (err, row) => {
        if (err) {
            res.send({
                err: err,
                status: -1
            });
        } else {
            res.send(row);
        }
    });
});

/**Obtengo todas las materias que son preladas por una materia dada
 *
 */
router.get(`/:id/prelandos`, function (req, res) {

    db.all(`select * from materia_x_pensum INNER JOIN prelacion ON materia_x_pensum.id_materia = prelacion.id_prelante where id_prelante =  ${req.params.id}`, (err, row) => {
        if (err) {
            res.send({
                err: err,
                status: -1
            });
        } else {
            res.send(row);
        }
    });
});

module.exports = router;