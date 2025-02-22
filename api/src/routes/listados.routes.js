const {Router} = require('express');

const{
    createListadoVacMov,
    getListadoVacMov,
    editListadoVacMov
} = require('../controllers/listadoVacanteMov.controllers');

const router = Router();

// Traer todos los listados de vacantes de movimiento
router.get('/listadovacmov', getListadoVacMov);

// Crear un listado de vacantes de movimiento
router.post('/listadovacmov', createListadoVacMov);

// Editar un listado de vacantes de movimiento
router.put('/listadovacmov/:idListadoVacMov', editListadoVacMov);

module.exports = router;