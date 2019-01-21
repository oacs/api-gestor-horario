import {
    Router
} from 'express';
import {
    db
} from '../..';

const router = Router();

/**Obtengo todos los registros
 * 
 */
router.get(`/`, function (req, res) {
    db.all(`select * from profesor`, (err, row) => {
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

/**Busco dado su id
 * @param id int
 */
router.get(`/:id`, function (req, res) {

    db.get(`select * from profesor where id =  ${req.params.id}`, (err, row) => {
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
//TODO: enviar mensaje de status
/**Elimino dado su id
 * @param id int
 */
router.delete(`/:id`, function (req, res) {

    db.get(`delete from profesor where id =  ${req.params.id}`, (err, row) => {
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


//TODO: Rehacer
/**Actualiza dado su id
 * @param id int
 */

router.put(`/:id`, function (req, res) {
    if (req.body.nombre) {
        db.get(`UPDATE profesor SET disp = '${req.body.disp}', nombre = '${req.body.nombre}', correo = '${req.body.correo}' WHERE id = ${req.params.id}`, (err, row) => {
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

router.post(`/`, function (req, res) {

    console.log(req.body);
    db.run(`insert into profesor(disp, nombre, correo)  values ('${req.body.disp}', '${req.body.nombre}', '${req.body.correo}')`, (err, row2) => {
        if (err) {
            res.send({
                err: err,
                status: -1
            });
        } else {
            db.get(`select id from profesor order by id DESC limit 1;`, (err, row) => {
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

router.get(`/:id/horariosAnteriores`, function (req, res) {

    db.all(`SELECT
    curso.horario,
    periodo.nombre as periodo
    FROM
    curso
    INNER JOIN periodo ON curso.id_periodo = periodo.id
    WHERE
    curso.id_profesor = ${req.params.id}`, (err, row) => {
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