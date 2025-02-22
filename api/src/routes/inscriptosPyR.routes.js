const {Router} = require('express');

const{
    getAllInscriptosPyR
} = require('../controllers/inscriptosPyR.controllers');

const router = Router();

//trae todos los inscriptos de P y R
router.post('/inscriptospr', getAllInscriptosPyR);

module.exports=router;