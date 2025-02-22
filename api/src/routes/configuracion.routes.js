const {Router} = require('express');

const {
    getConfiguracion,
    getConfigComponente,
    updateActivoComponente
} = require('../controllers/configuracion.controllers');

const router = Router();

router.get('/configuracion', getConfiguracion);

/**Trae tabla de config_component_active */
router.get('/configcomponente', getConfigComponente);

/**Actualiza Estado Activo de Componente */
router.put('/updactivocomponente', updateActivoComponente);

module.exports = router;