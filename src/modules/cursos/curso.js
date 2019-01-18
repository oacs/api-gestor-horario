import { Router } from 'express';
import { db } from '../..';

const router = Router();
/** Retorna todos los cursos
 * 
 */
router.get(`/`, function (req, res) {
    db.all(`select * from curso`, (err, row) => {
        console.log(err);
        // console.log(row);
        res.send(row);
    });
});
/** Hace una busqueda por los siguientes parametros
 * @param id_profesor int
 * @param id_periodo int
 * @param id_materia int
 * @param id_pensum int
 * @param seccion text
 * @param semestre int
 * @return rows Curso[]
 */

router.get(`/:id_profesor/:id_periodo/:id_materia/:id_pensum`, function (req, res) {

    db.get(`select * from curso where id_profesor =  ${req.params.id_profesor} and id_periodo = ${req.params.id_periodo} and id_materia = ${req.params.id_materia} and id_pensum = ${req.params.id_pensum}`, (err, row) => {
        console.log(err);
        // console.log(row);
        res.send(row);
    });
});

/** Elimina un curso
 * @param id_periodo int
 * @param id_materia int
 * @param id_pensum int
 * @param seccion text
 * @return rows Curso[]
 */
router.delete(`/:id_materia/:id_pensum/:id_periodo/:seccion`, function (req, res) {

    db.get(`delete from curso where id_materia = ${req.params.id_materia} and id_pensum = ${req.params.id_pensum} and id_periodo = ${req.params.id_periodo} and seccion = ${req.params.seccion}`, (err, row) => {
        console.log(err);
        // console.log(row);
        res.send({ msg: `Eliminado correctamente` })
    });
});
/** Actualiza un registro
 * @body id_profesor int
 * @body horario
 * @body semestre
 * @param id_periodo int
 * @param id_materia int
 * @param id_pensum int
 * @param seccion text
 * @return result boolean
 */

router.put(`/:id_materia/:id_pensum/:id_periodo/:seccion`, function (req, res) {

    db.run(`UPDATE curso SET id_profesor = ${req.body.id_profesor}, horario = '${req.body.horario}'  where id_materia = ${req.params.id_materia} and id_pensum = ${req.params.id_pensum} and id_periodo = ${req.params.id_periodo} and seccion = ${req.params.seccion}`, (err) => {
        console.log(err);
    });
    res.send({ msg: `Actualizado correctamente` })
});

/** Inserta un registro
 * @body id_profesor int
 * @body horario
 * @body semestre
 * @body id_periodo int
 * @body id_materia int
 * @body id_pensum int
 * @body seccion text
 * @return result boolean
 */
router.post(`/`, function (req, res) {

    // console.log(req.body);
    db.run(`insert into curso( id_profesor, id_periodo, id_materia, semestre, seccion, id_pensum, horario)  values ( ${req.body.id_profesor}, ${req.body.id_periodo}, ${req.body.id_materia}, ${req.body.semestre}, ${req.body.seccion}, ${req.body.id_pensum}, '${req.body.horario}')`, {
    }, info => {
        console.log(info);
        res.send({ msg: `Insertado correctamente` })
    });
});

module.exports = router;
