Object.defineProperty(exports, "__esModule", { value: true });

import { Router } from 'express';
import { db } from '../..';
var fs = require('fs');
var path =  require('path');

const router = Router();

/** Obtengo todos los registros
 *
 */
router.get(`/`, function (req, res) {
    db.all(`select * from periodo`, (err, row) => {
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

    db.get(`select * from periodo where id =  ${req.params.id}`, (err, row) => {
        if (err) {
            res.send({err: err});
        } else {
            if (row == null) {
                res.status(404);
                res.send({ msg: 'Periodo no encontrado', status: -1})
            } else {

                res.send(row);
            }
        }
    });
});

/**Elimino un registro dado su id
 * @param id int
 */
router.delete(`/:id`, function (req, res) {

    db.get(`delete from periodo where id =  ${req.params.id}`, (err, row) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send({ msg: `Actualizado correctamente`, status: 1  })
        }

    });
});

/** Actualizo un registro dado un id
 * @param id int
 * @body nombre text
 */
router.put(`/:id`, function (req, res) {

    db.run(`UPDATE periodo SET nombre = '${req.body.nombre}'  where id = ${req.params.id}`, (result, err) => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send({ msg: `Actualizado correctamente`, status: 1  })
        }
    });

});

/** Guardo un registro dado un id
 * @body nombre text
 */
router.post(`/`, function (req, res) {

    console.log(req.body);
    db.run(`insert into periodo(nombre) values ('${req.body.nombre}')`, err => {
        if (err) {
            res.send({err: err, status: -1});
        } else {
            res.send({ msg: `Agregado correctamente`, status: 1 })
        }
    });
});

router.get('/:id/horario/export', (req,res) => {
    let query = `select c.horario, c.seccion, c.semestre, p.nombre as profesor, pe.nombre as periodo, m.nombre as materia 
    from curso as c
    inner join profesor as p on c.id_profesor = p.id
    inner join periodo as pe on c.id_periodo = pe.id
    inner join materia_x_pensum as mxp on mxp.id_materia = c.id_materia and c.id_pensum = mxp.id_pensum
    inner join materia as m on mxp.id_materia = m.id
    inner join pensum as pen on c.id_pensum = pen.id
    where pe.id = ${req.params.id}
    order by c.semestre`;
    db.all(query, (err,data) => {
				if(err) console.log(err);
				let horariosSemestrales = dataToHorario(data);
				let fileContent = ExportfileContent(horariosSemestrales.s1,1);
				fileContent += ExportfileContent(horariosSemestrales.s2,2);
				fileContent += ExportfileContent(horariosSemestrales.s3,3);
				fileContent += ExportfileContent(horariosSemestrales.s4,4);
				fileContent += ExportfileContent(horariosSemestrales.s5,5);
				fileContent += ExportfileContent(horariosSemestrales.s6,6);
				fileContent += ExportfileContent(horariosSemestrales.s7,7);
				fileContent += ExportfileContent(horariosSemestrales.s8,8);
				fileContent += ExportfileContent(horariosSemestrales.s9,9);
				fileContent += ExportfileContent(horariosSemestrales.s10,10);

				fs.writeFile(path.join(__dirname, '../../../.tmp/excelPeriodo.csv'), fileContent, function (err) {
					if (err) throw err;
				});
				res.download(path.join(__dirname, '../../../.tmp/excelPeriodo.csv'), function (err) {
					console.log(err);
				  });
    });
	});
	function dataToHorario(data) {
		let horario = {s1 : data.filter(curso => curso.semestre == 1),
			s2 : data.filter(curso => curso.semestre == 2),
			s3 : data.filter(curso => curso.semestre == 3),
			s4 : data.filter(curso => curso.semestre == 4),
			s5 : data.filter(curso => curso.semestre == 5),
			s6 : data.filter(curso => curso.semestre == 6),
			s7 : data.filter(curso => curso.semestre == 7),
			s8 : data.filter(curso => curso.semestre == 8),
			s9 : data.filter(curso => curso.semestre == 9),
			s10 : data.filter(curso => curso.semestre == 10)
		};
		horario.s1.forEach(curso => {
			curso.horario = stringToDisponibilidad(curso.horario);
		});
		horario.s2.forEach(curso => {
			curso.horario = stringToDisponibilidad(curso.horario);
		});
		horario.s3.forEach(curso => {
			curso.horario = stringToDisponibilidad(curso.horario);
		});
		horario.s4.forEach(curso => {
			curso.horario = stringToDisponibilidad(curso.horario);
		});
		horario.s5.forEach(curso => {
			curso.horario = stringToDisponibilidad(curso.horario);
		});
		horario.s6.forEach(curso => {
			curso.horario = stringToDisponibilidad(curso.horario);
		});
		horario.s7.forEach(curso => {
			curso.horario = stringToDisponibilidad(curso.horario);
		});
		horario.s8.forEach(curso => {
			curso.horario = stringToDisponibilidad(curso.horario);
		});
		horario.s9.forEach(curso => {
			curso.horario = stringToDisponibilidad(curso.horario);
		});
		horario.s10.forEach(curso => {
			curso.horario = stringToDisponibilidad(curso.horario);
		});
		return horario;
	}

	function stringToDisponibilidad(dispSerializada) {
		var disp  = [];
		dispSerializada.split(',').forEach((dia) => {
				const bloques = dia.substring(1);
				for (let i = 0; i < bloques.length / 3; i++) {
					disp.push({
								dia : stringToDay(dia[0]),
								inicio : stringToHour(bloques[(i * 3)]),
								fin : stringToHour(bloques[(i * 3) + 1]),
								prioridad : bloques[(i * 3) + 2]
					});
				}
		});
		return disp;
    }

	function stringToHour(numero){
		switch (numero) {
				case '1': return 1;
				case '2': return 2;
				case '3': return 3;
				case '4': return 4;
				case '5': return 5;
				case '6': return 6;
				case '7': return 7;
				case '8': return 8;
				case '9': return 9;
				case 'A': return 10;
				case 'B': return 11;
				case 'C': return 12;
				case 'D': return 13;
				case 'E': return 14;
				case 'F': return 15;
				default: return 0;
		}
	}	
	function stringToDay(numero){
		switch (numero) {
				case '1': return 'MARTES';
				case '2': return 'MIERCOLES';
				case '3': return 'JUEVES';
				case '4': return 'VIERNES';
				case '5': return 'SABADO';
				case '6': return 'DOMINGO';
				default: return 'LUNES';
		}
	}
	function ExportfileContent(disp,semestre){
		let fileContent = `SEMESTRE ${semestre}\n`		
		fileContent += `HORA;LUNES;MARTES;MIERCOLES;JUEVES;VIERNES;SABADO;DOMINGO\n`;
		fileContent += `7:00AM;${getPrioridad(disp,'LUNES',0)};${getPrioridad(disp,'MARTES',0)};${getPrioridad(disp,'MIERCOLES',0)};${getPrioridad(disp,'JUEVES',0)};${getPrioridad(disp,'VIERNES',0)};${getPrioridad(disp,'SABADO',0)};${getPrioridad(disp,'DOMINGO',0)}\n`;
		fileContent += `8:00AM;${getPrioridad(disp,'LUNES',1)};${getPrioridad(disp,'MARTES',1)};${getPrioridad(disp,'MIERCOLES',1)};${getPrioridad(disp,'JUEVES',1)};${getPrioridad(disp,'VIERNES',1)};${getPrioridad(disp,'SABADO',1)};${getPrioridad(disp,'DOMINGO',1)}\n`;
		fileContent += `9:00AM;${getPrioridad(disp,'LUNES',2)};${getPrioridad(disp,'MARTES',2)};${getPrioridad(disp,'MIERCOLES',2)};${getPrioridad(disp,'JUEVES',2)};${getPrioridad(disp,'VIERNES',2)};${getPrioridad(disp,'SABADO',2)};${getPrioridad(disp,'DOMINGO',2)}\n`;
		fileContent += `10:00AM;${getPrioridad(disp,'LUNES',3)};${getPrioridad(disp,'MARTES',3)};${getPrioridad(disp,'MIERCOLES',3)};${getPrioridad(disp,'JUEVES',3)};${getPrioridad(disp,'VIERNES',3)};${getPrioridad(disp,'SABADO',3)};${getPrioridad(disp,'DOMINGO',3)}\n`;
		fileContent += `11:00AM;${getPrioridad(disp,'LUNES',4)};${getPrioridad(disp,'MARTES',4)};${getPrioridad(disp,'MIERCOLES',4)};${getPrioridad(disp,'JUEVES',4)};${getPrioridad(disp,'VIERNES',4)};${getPrioridad(disp,'SABADO',4)};${getPrioridad(disp,'DOMINGO',4)}\n`;
		fileContent += `12:00AM;${getPrioridad(disp,'LUNES',5)};${getPrioridad(disp,'MARTES',5)};${getPrioridad(disp,'MIERCOLES',5)};${getPrioridad(disp,'JUEVES',5)};${getPrioridad(disp,'VIERNES',5)};${getPrioridad(disp,'SABADO',5)};${getPrioridad(disp,'DOMINGO',5)}\n`;
		fileContent += `1:00PM;${getPrioridad(disp,'LUNES',6)};${getPrioridad(disp,'MARTES',6)};${getPrioridad(disp,'MIERCOLES',6)};${getPrioridad(disp,'JUEVES',6)};${getPrioridad(disp,'VIERNES',6)};${getPrioridad(disp,'SABADO',6)};${getPrioridad(disp,'DOMINGO',6)}\n`;
		fileContent += `2:00PM;${getPrioridad(disp,'LUNES',7)};${getPrioridad(disp,'MARTES',7)};${getPrioridad(disp,'MIERCOLES',7)};${getPrioridad(disp,'JUEVES',7)};${getPrioridad(disp,'VIERNES',7)};${getPrioridad(disp,'SABADO',7)};${getPrioridad(disp,'DOMINGO',7)}\n`;
		fileContent += `3:00PM;${getPrioridad(disp,'LUNES',8)};${getPrioridad(disp,'MARTES',8)};${getPrioridad(disp,'MIERCOLES',8)};${getPrioridad(disp,'JUEVES',8)};${getPrioridad(disp,'VIERNES',8)};${getPrioridad(disp,'SABADO',8)};${getPrioridad(disp,'DOMINGO',8)}\n`;
		fileContent += `4:00PM;${getPrioridad(disp,'LUNES',9)};${getPrioridad(disp,'MARTES',9)};${getPrioridad(disp,'MIERCOLES',9)};${getPrioridad(disp,'JUEVES',9)};${getPrioridad(disp,'VIERNES',9)};${getPrioridad(disp,'SABADO',9)};${getPrioridad(disp,'DOMINGO',9)}\n`;
		fileContent += `5:00PM;${getPrioridad(disp,'LUNES',10)};${getPrioridad(disp,'MARTES',10)};${getPrioridad(disp,'MIERCOLES',10)};${getPrioridad(disp,'JUEVES',10)};${getPrioridad(disp,'VIERNES',10)};${getPrioridad(disp,'SABADO',10)};${getPrioridad(disp,'DOMINGO',10)}\n`;
		fileContent += `6:00PM;${getPrioridad(disp,'LUNES',11)};${getPrioridad(disp,'MARTES',11)};${getPrioridad(disp,'MIERCOLES',11)};${getPrioridad(disp,'JUEVES',11)};${getPrioridad(disp,'VIERNES',11)};${getPrioridad(disp,'SABADO',11)};${getPrioridad(disp,'DOMINGO',11)}\n`;
		fileContent += `7:00PM;${getPrioridad(disp,'LUNES',12)};${getPrioridad(disp,'MARTES',12)};${getPrioridad(disp,'MIERCOLES',12)};${getPrioridad(disp,'JUEVES',12)};${getPrioridad(disp,'VIERNES',12)};${getPrioridad(disp,'SABADO',12)};${getPrioridad(disp,'DOMINGO',12)}\n`;
		fileContent += `8:00PM;${getPrioridad(disp,'LUNES',13)};${getPrioridad(disp,'MARTES',13)};${getPrioridad(disp,'MIERCOLES',13)};${getPrioridad(disp,'JUEVES',13)};${getPrioridad(disp,'VIERNES',13)};${getPrioridad(disp,'SABADO',13)};${getPrioridad(disp,'DOMINGO',13)}\n`;
		fileContent += `9:00PM;${getPrioridad(disp,'LUNES',14)};${getPrioridad(disp,'MARTES',14)};${getPrioridad(disp,'MIERCOLES',14)};${getPrioridad(disp,'JUEVES',14)};${getPrioridad(disp,'VIERNES',14)};${getPrioridad(disp,'SABADO',14)};${getPrioridad(disp,'DOMINGO',14)}\n`;
		fileContent += `10:00PM;${getPrioridad(disp,'LUNES',15)};${getPrioridad(disp,'MARTES',15)};${getPrioridad(disp,'MIERCOLES',15)};${getPrioridad(disp,'JUEVES',15)};${getPrioridad(disp,'VIERNES',15)};${getPrioridad(disp,'SABADO',15)};${getPrioridad(disp,'DOMINGO',15)}\n`;
		return fileContent
	}
	function getPrioridad(curso,day,hour) {
		let element = curso.find(bloque => {
			let result = bloque.horario.find(disp => {
				return disp.dia == day && (disp.inicio <= hour && disp.fin >= hour)
			});
			return result;
		});
	
		if (typeof element === 'undefined') return ' ';
		return `${element.profesor} ${element.materia}`;
	}
module.exports = router;
