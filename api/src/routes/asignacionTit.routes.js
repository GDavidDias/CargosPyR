const {Router} = require('express');

const{
    createAsignacionTit,
    delAsignacionTit,
    getAllAsignacionesRealizadasTit,
    getAllAsignacionesTit
} = require('../controllers/asignacionTit.controllers');

const router = Router();

//crea una asignacion de docente a vacante
//paso datos por body
router.post('/createasignaciontit', createAsignacionTit);

//elimino una asignacion, se desactiva por medio campo obsdesactiva
router.post('/delasignaciontit/:idAsignacionTit', delAsignacionTit);

//listado de asignaciones realizadas de titularizacion
router.post('/asignacionesrealizadastit', getAllAsignacionesRealizadasTit);

//Todas las asignaciones realizadas de titulares
router.post('/allasignacionestit', getAllAsignacionesTit);

module.exports = router;