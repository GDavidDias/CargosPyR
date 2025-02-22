const {Router} = require('express');

const{
    getAllEscuelas
} = require('../controllers/escuelas.controllers');

const router = Router();

//Trae todas las escuelas y datos
router.get('/getallescuelas', getAllEscuelas);

module.exports = router;