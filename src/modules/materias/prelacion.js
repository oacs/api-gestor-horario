import { Router } from 'express';
import { db } from '../..';

const router = Router();
/**Obtiene todas los registros
 * 
 */
router.get(`/`, function (req, res) {
    db.all(`select * from prelacion`, (err, row) => {
        console.log(err);
        // console.log(row);
        res.send(row);
    });
});


router.get(`/:id_prelacion`, function (req, res) {

    db.get(`select * from prelacion where id_prelacion =  ${req.params.id_prelacion}`, (err, row) => {
        console.log(err);
        // console.log(row);
        res.send(row);
    });
});

/** Elimina registros dados los id
 * @param id_materia int
 * @param id_pensum int
 * @return materia_x_pensum[]
 */
router.delete(`/:id_prelacion`, function (req, res) {

    db.get(`delete from prelacion where id_prelacion =  ${req.params.id_prelacion}`, (err, row) => {
        console.log(err);
        // console.log(row);
        res.send({msg : `Eliminado correctamente`});
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
    db.run(`UPDATE prelacion SET id_prelada = ${req.body.id_prelada}, id_prelante = ${req.body.id_prelante}, id_pensum = ${req.body.id_pensum} where id_prelacion = ${req.params.id_prelacion}`, info => {
        console.log(info);
        res.send({ msg: `Actualizado correctamente` })
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
    db.run(`insert into prelacion( id_prelada, id_prelante, id_pensum)  values ( ${req.body.id_prelada}, ${req.body.id_prelante}, ${req.body.id_pensum})`, {
    }, info => {
        console.log(info);
        res.send({ msg: `Insertado correctamente` })
    });
});

module.exports = router;
