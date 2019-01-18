
import { Router } from 'express';
import { db } from '../..';

const router = Router();

/** Obtengo todos los registros
 *
 */
router.get(`/`, function (req, res) {
  db.all(`select * from materia`, (err, row) => {
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

  db.get(`select * from materia where id =  ${req.params.id}`, (err, row) => {
    if (err) {
        res.send({err: err, status: -1});
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
        res.send({err: err, status: -1});
    } else {
        res.send({ msg: `Registro eliminado correctamente` });
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
          res.send({err: err, status: -1});
      } else {
          res.send({ msg: `Registro actualizado correctamente` });
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
          res.send({err: err, status: -1});
      } else {
          db.get(`select id from materia order by id DESC limit 1;`, (err, row) => {
              if (err) {
                  res.send({err: err, status: -1});
              } else {
                  res.send(row);
              }
          })
      }
  });
});

module.exports = router;
