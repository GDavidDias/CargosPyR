const {Router} = require('express');

const {
    getEspecidalidades,
    updateEspecialidadVisorTit
} = require('../controllers/especialidad.controllers');

const router = Router();

/**Trae todas las especialidades */
router.get('/allespecialidades', getEspecidalidades);

/**Actualiza una especialidad en su campo activo_visor_tit */
router.put('/updespevisortit', updateEspecialidadVisorTit);


module.exports = router;