"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
import { Router } from 'express';
import { db } from '../..';
var fs = require('fs');
var path =  require('path');
var multer  = require('multer')
var upload = multer({ dest: '.tmp/' })

const router = Router();

router.get('/:id/disponibilidad/excel', function (req, res) {
  db.get(`select * from profesor where id = ${req.params.id}`, (err, profesor) => {
    console.log(err);
    var disp = stringToDisponibilidad(profesor.disp);

    fs.writeFile(path.join(__dirname, '../../../.tmp/excel.csv'), ExportfileContent(disp), function (err) {
      if (err) throw err;
    });

    res.download(path.join(__dirname, '../../../.tmp/excel.csv'), function (err) {
      console.log(err);
    });
  });
});
router.post('/:id/disponibilidad/excel',upload.single('excel'), function (req, res, next) {
  console.log(req.file.filename);
  fs.readFile(path.join(__dirname,`../../../.tmp/${req.file.filename}`),"utf-8", function(err, data) {
    let disp = excelToDisponibilidad(data);
    disp = DisponibilidadToString(disp);
    console.log(disp);
    db.run(`UPDATE profesor SET disp = '${disp}' WHERE id = ${req.params.id}`, function (info) {
        console.log(info);
        res.send(info);
        fs.unlink(path.join(__dirname,`../../../.tmp/${req.file.filename}`), function (err) {
          if (err) throw err;
        });
    });
  });
})

function DisponibilidadToString(disp) {
  let texto = '';
  let day = disp[0].dia;
  texto += day + '';
  disp.forEach(row => {
      if (day !== row.dia) {
          day = row.dia;
          texto += ',' + day;
      }
      texto += (row.inicio + row.fin + row.prioridad);
  });
  return texto;
}
function excelToDisponibilidad(data) {
  let disp = [];
  data = stringToArray(data);
  for (let i = 1; i < data[0].length; i++) {
    for (let j = 0; j < data.length; j++) {
      const element = data[j][i];
      if(data[j][i] != '0'){
        disp.push({
          dia : i-1,
          inicio : decimalToHexadecimal(j),
          fin : decimalToHexadecimal(j),
          prioridad : data[j][i]
        });
      }

    }  
  }
  return disp;
}
function stringToArray(data) {
  data = data.split("\n")
  data =data.slice(1, -1);
  data = data.map(row =>{
    return row.split(";");
    
  });
  return data
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
function ExportfileContent(disp){
  let fileContent = `HORA;LUNES;MARTES;MIERCOLES;JUEVES;VIERNES;SABADO;DOMINGO\n`;
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
  fileContent += `10:00PM;${getPrioridad(disp,'LUNES',15)};${getPrioridad(disp,'MARTES',15)};${getPrioridad(disp,'MIERCOLES',15)};${getPrioridad(disp,'JUEVES',15)};${getPrioridad(disp,'VIERNES',15)};${getPrioridad(disp,'SABADO',15)};${getPrioridad(disp,'DOMINGO',15)}`;
  return fileContent
}
function getPrioridad(disp,day,hour) {
  let element = disp.find(bloque => {
    return bloque.dia == day && (bloque.inicio <= hour && bloque.fin >= hour)
  });

  if (typeof element === 'undefined') return '0';
  return element.prioridad;
}
function stringToPriority(numero){
  switch (numero) {
      case '0': return 'NUNCA';
      case '1': return 'PREFERIDA';
      case '2': return 'OPCIONAL';
  }
}
function decimalToHexadecimal(number){
  let hexString = number.toString(16).toUpperCase();
return hexString
}

module.exports = router;