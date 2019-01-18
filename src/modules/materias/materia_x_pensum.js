import { Router } from 'express';
import { db } from '../..';

const router = Router();
/**Obtiene todas los registros
 * 
 */
router.get(`/`, function (req, res) {
    db.all(`select * from materia_x_pensum`, (err, row) => {
        console.log(err);
        // console.log(row);
        res.send(row);
    });
});


router.get(`/:id_materia/:id_pensum`, function (req, res) {

    db.get(`select * from materia_x_pensum where id_materia =  ${req.params.id_materia} and id_pensum = ${req.params.id_pensum} `, (err, row) => {
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
router.delete(`/:id_materia/:id_pensum`, function (req, res) {

    db.get(`delete from materia_x_pensum where id_materia =  ${req.params.id_materia} and id_pensum =  ${req.params.id_pensum}`, (err, row) => {
        console.log(err);
        // console.log(row);
        res.send(row);
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

    db.run(`UPDATE materia_x_pensum SET horas = ${req.body.horas}, maxH = ${req.body.maxH}, semestre = ${req.body.semestre}  where id_materia =  ${req.params.id_materia} and id_pensum =  ${req.params.id_pensum}`, (err) => {
        console.log(err);
    });
    res.send({ msg: `Actualizado correctamente` })
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
    }, info => {
        console.log(info);
        res.send(info);
    });
});

module.exports = router;
