const {Router} = require('express');

const {
    validateUser,
    changePass
} = require('../controllers/user.controllers');

const router = Router();

router.post('/validate', validateUser);

//ruta para cambiar contraseña, datos pasan por body
router.put('/changepass', changePass);

module.exports = router;