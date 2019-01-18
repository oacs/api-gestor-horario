import { Router } from 'express';
import { db } from '../..';

const router = Router();

/**Obtengo todos los registros
 * 
 */
router.get(`/`, function (req, res) {
    db.all(`select * from profesor`, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
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
            res.send({err: err, status: -1});
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
            res.send({err: err, status: -1});
        } else {
            res.send({ msg: `Registro eliminado correctamente` });
        }
    });
});


//TODO: Rehacer
/**Actualiza dado su id
 * @param id int
 */

router.put(`/:id`, function (req, res) {
    if (req.body.nombre) {
      db.run(`UPDATE profesor SET disp = $disp, nombre = $nombre, correo = $correo WHERE id = $id`, {
          $id: req.params.id,
          $nombre: req.body.nombre
      }, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send({ msg: `Registro actualizado correctamente`, status: 1 });
        }
    });
  }
  
  });

router.post(`/`, function (req, res) {

    console.log(req.body);
    db.run(`insert into profesor(disp, nombre, correo)  values ('${req.body.disp}', '${req.body.nombre}', '${req.body.correo}')`, (err, row2) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            db.get(`select id from profesor order by id DESC limit 1;`, (err, row) => {
                if (err) {
                    res.send({err: err, status: -1});
                } else {
                    res.send(row);
                }
            })
        }
    });
});

router.get(`/horariosAnteriores/:id`, function (req, res) {

    db.get(`select horario, id_periodo from curso where id_profesor =  ${req.params.id}`, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send(row);
        }
    });
});


module.exports = router;
