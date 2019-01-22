import { Router } from 'express';
import { db } from '../..';

const router = Router();
/**Obtiene todas los registros
 * 
 */
router.get(`/`, function (req, res) {
    db.all(`select * from prelacion`, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send(row);
        }
    });
});


router.get(`/:id_prelada`, function (req, res) {

    db.all(`select * from prelacion where id_prelacion =  ${req.params.id_prelada}`, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send(row);
        }
    });
});

router.get(`/:id_prelada/prelantesInfo`, function (req, res) {

    db.all(`select materia.nombre, materia_x_pensum.semestre from prelacion 
    INNER JOIN materia_x_pensum ON prelacion.id_prelante = materia_x_pensum.id_materia
    INNER JOIN materia ON materia_x_pensum.id_materia = materia.id
    where prelacion.id_prelada = ${req.params.id_prelada}`, (err, row) => {
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
router.delete(`/:id_prelacion`, function (req, res) {

    db.get(`delete from prelacion where id_prelacion =  ${req.params.id_prelacion}`, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send(row);
        }
    });
});

router.delete(`/:id_pensum/byPensum`, function (req, res) {

    db.get(`delete from prelacion where id_pensum =  ${req.params.id_pensum}`, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send(row);
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

router.put(`/:id_prelacion`, function (req, res) {

    // console.log(req.body);
    db.run(`UPDATE prelacion SET id_prelada = ${req.body.id_prelada}, id_prelante = ${req.body.id_prelante}, id_pensum = ${req.body.id_pensum}, tipo = ${req.body.tipo} where id_prelacion = ${req.params.id_prelacion}`, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send({ msg: `Actualizado correctamente` , status: 1});
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
    db.run(`insert into prelacion( id_prelada, id_prelante, id_pensum, tipo)  values ( ${req.body.id_prelada}, ${req.body.id_prelante}, ${req.body.id_pensum}, ${req.body.tipo})`, {
    }, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send({ msg: `Insertado correctamente`, status: 1 });
        }
    });
});

module.exports = router;
