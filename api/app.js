const http = require('http');
const { Server } = require('socket.io');

const express = require('express');
const cors = require('cors');

const especialidadRoutes = require('./src/routes/especialidad.routes.js');
const inscriptosMovRoutes = require('./src/routes/inscriptos.routes.js');
const vacantesRoutes = require('./src/routes/vacantes.routes.js');
const listadoVacMovRoutes = require('./src/routes/listados.routes.js');
const asignacionMovRoutes = require('./src/routes/asignacion.routes.js');
const configuracionRoutes = require('./src/routes/configuracion.routes.js');
const userRoutes = require('./src/routes/user.routes.js');
const inscriptosTitRoutes = require('./src/routes/inscriptosTit.routes.js');
const vacantesTitRoutes = require('./src/routes/vacantesTit.routes.js');
const asignacionTitRoutes = require('./src/routes/asignacionTit.routes.js');
const escuelasRoutes = require('./src/routes/escuelas.routes.js');
const inscriptosPyRRoutes = require('./src/routes/inscriptosPyR.routes.js');
const vacantesPyRRoutes = require('./src/routes/vacantesPyR.routes.js');


const app = express();


//Configuracion de Middlewares
app.use(express.urlencoded({extended:true}));
app.use(express.json());

//HABILITO CORS
app.use(cors());

//creo servidor http para socket
const server = http.createServer(app);

//configuro socket io con el servidor
//const io=socketIo(server);
const io = new Server(server,{
    cors:{
        origin:"*",
        methods: ["GET" , "POST"]
    }
});

//const io = new Server(server);

//Escucho conexiones de clientes socket
io.on("connection", (socket)=>{
    console.log("Cliente conectado: ", socket.id);

    socket.on('solicitud-cliente',(data)=>{
        console.log(data);
    });
})

//rutas
app.use('/api', especialidadRoutes);
app.use('/api', inscriptosMovRoutes);
app.use('/api', vacantesRoutes);
app.use('/api', listadoVacMovRoutes);
app.use('/api', asignacionMovRoutes);
app.use('/api', configuracionRoutes);
app.use('/api', userRoutes);

//Rutas Modulo Titularizaciones
app.use('/api', inscriptosTitRoutes);
app.use('/api', vacantesTitRoutes);
app.use('/api', asignacionTitRoutes);

//Rutas Modulo Provisionales y Reemplazantes
app.use('/api', inscriptosPyRRoutes);
app.use('/api', vacantesPyRRoutes);

//Rutas de modulos generales
app.use('/api', escuelasRoutes);



//server.listen(3001,()=>{console.log("Server Socket is Running")})

//module.exports = app;
module.exports = server;