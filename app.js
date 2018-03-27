/**
 * Created by Tomás on 17-12-2017.
 */
'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

app.use((req, res, next) =>{
    res.header('Access-Control-Allow-Origin','*');
    res.header("Access-Control-Allow-Headers", "X-Requested-With, Content-Type");

    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,PATCH,OPTIONS');
    res.header('Allow', 'GET, POST, OPTION, PUT, DELETE');

    next();
});

//middleware bodyparser (Para que es necesario?)
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());

//cargar rutas
/*const usuario_routes = require('./server/routes/usuario');
const gestionLegal_routes = require('./server/routes/gestionLegal');
const asunto_routes = require('./server/routes/asunto');
const solicitud_routes = require('./server/routes/solicitud');*/

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist')));

//Ruta Base
/*app.use('/api/usuario', usuario_routes);
app.use('/api/gestionlegal', gestionLegal_routes);
app.use('/api/asunto', asunto_routes);
app.use('/api/solicitud', solicitud_routes);*/

app.post('/printer', (req, res) =>{
    const params = req.body;
    const hora = new Date();
    let printer = require('node-thermal-printer');
    printer.init({
       type: 'printer',
       interface: '/dev/usb/lp0'
    });
    printer.alignCenter();
    printer.println('TICKET DE ALMUERZO');
    printer.drawLine();
    printer.alignLeft();
    printer.println('Nombre: ' + params.nombre + '        - RUT: ' + params.rut);
    printer.println('Tipo: ' + params.tipo + '               - Empresa: '+ params.empresa);
    printer.alignCenter();
    printer.println('Dia: ' + hora.getDay() + ' - Hora: ' + hora.getHours() + ':' + hora.getMinutes());
    printer.drawLine();
    printer.println('Gracias!!');
    printer.cut();
    printer.execute(function (err) {
        if(err) {
            console.log('print error: ' + err);
            res.status(500).send({
                desc: 'Printer Error',
                err: err.message
            })
        } else {
            console.log('print DONE!!');
            res.status(200).send({
                desc: 'Printer done!'
            })
        }
    })
});
// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/index.html'));
});

//rutas body-parser
module.exports = app;