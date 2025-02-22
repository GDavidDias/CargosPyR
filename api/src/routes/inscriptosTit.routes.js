const {Router} = require('express');

const{
    getAllInscriptosTit,
    editInscriptoTit,
    updestadoinscriptotit,
    getReporteEstadoInscriptosTit,
}= require('../controllers/inscriptosTit.controllers');

const router = Router();

//trae todos los inscriptos de titularizacion
router.post('/inscriptostit', getAllInscriptosTit);

//Modifica datos del inscripto
router.put('/editinscriptotit/:idInscriptoTit',editInscriptoTit);

//Actualiza estado de inscripto
router.put('/updestadoinscriptotit/:idInscriptoTit', updestadoinscriptotit);

//Listado para reporte de Inscriptos y Estado del inscripto, si tomo alguna vacante o no.
router.post('/repoestadoinscriptostit', getReporteEstadoInscriptosTit);

module.exports=router;