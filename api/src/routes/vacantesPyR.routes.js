const {Router} = require('express');

const {
    getAllVacantesPyR,
    getVacanteAsignadaPyR
} = require('../controllers/vacantesPyR.controllers');

const router = Router();

//Trae todas las vacantes de Provisionales y Reemplazantes
router.post('/allvacantespyr', getAllVacantesPyR);

//Trae datos de una vacante
router.post('/vacantepr/:idVacantePyR', getVacanteAsignadaPyR);


module.exports = router;
