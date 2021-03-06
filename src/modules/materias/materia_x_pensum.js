import { Router } from 'express';
import { db } from '../..';

const router = Router();
/**Obtiene todas los registros
 * 
 */
router.get(`/`, function (req, res) {
    db.all(`select * from materia_x_pensum`, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send(row);
        }
    });
});


router.get(`/:id_pensum/byPensum`, function (req, res) {

    db.all(`select * from materia_x_pensum 
    inner join materia on materia_x_pensum.id_materia = materia.id 
    where id_pensum = ${req.params.id_pensum} order by id_materia`, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send(row);
        }
    });
});


router.get(`/:id_periodo/byPeriodo`, function (req, res) {

    db.all(`select * from materia_x_pensum 
    inner join materia on materia_x_pensum.id_materia = materia.id 
    inner join curso on materia.id = curso.id_materia
    where id_periodo = ${req.params.id_periodo} order by id_materia`, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send(row);
        }
    });
});

router.get(`/:id_materia/:id_pensum`, function (req, res) {

    db.get(`select * from materia_x_pensum where id_materia =  ${req.params.id_materia} and id_pensum = ${req.params.id_pensum} `, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send(row);
        }
    });
});


/** Elimina registros dados los id
 * @param id_materia int
 * @param id_pensum int
 * @return materia_x_pensum[]
 */
router.delete(`/:id_materia/:id_pensum`, function (req, res) {

    db.get(`delete from materia_x_pensum where id_materia =  ${req.params.id_materia} and id_pensum =  ${req.params.id_pensum}`, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send({ msg: `Registro eliminado correctamente` });
        }
    });
});


/** Elimina todas las materias de un pensum dado
 * @param id_materia int
 * @param id_pensum int
 * @return materia_x_pensum[]
 */
router.delete(`/:id_pensum`, function (req, res) {

    db.get(`delete from materia_x_pensum where id_pensum =  ${req.params.id_pensum}`, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send({ msg: `Registros eliminados correctamente` });
        }
    });
});


/** Actualiza atributos dado los id
 * @param id_materia int
 * @param id_pensum int
 * @body horas int
 * @body maxH int
 * @return result boolean
 */

router.put(`/:id_materia/:id_pensum`, function (req, res) {

    db.run(`UPDATE materia_x_pensum SET horas = ${req.body.horas}, maxH = ${req.body.maxH}, semestre = ${req.body.semestre}  where id_materia =  ${req.params.id_materia} and id_pensum =  ${req.params.id_pensum}`, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send({ msg: `Actualizado correctamente`, status: 1 });
        }
    });
});


/** Obtiene registros dados los parametros
 * @body id_materia int
 * @body id_pensum int
 * @body horas int
 * @body maxH int
 * @return result boolean
 */
router.post(`/`, function (req, res) {

    // console.log(req.body);
    db.run(`insert into materia_x_pensum(id_materia, id_pensum, horas, maxH, semestre)  values ( $id_materia, $id_pensum, $horas, $maxH, $semestre)`, {
        $id_materia: req.body.id_materia,
        $id_pensum: req.body.id_pensum,
        $horas: req.body.horas,
        $maxH: req.body.maxH,
        $semestre: req.body.semestre
    }, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send({ msg: `Insertado correctamente` , status: 1});
        }
    });
});

module.exports = router;
