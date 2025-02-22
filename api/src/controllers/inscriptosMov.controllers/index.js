const getAllInscriptosMov = require('./getAllInscriptosMov.js');
const editInscriptoMov = require('./editInscriptoMov.js');
const updateIdVacanteGenerada = require('./updateIdVacanteGenerada.js');
const validateDniAsignado = require('./validateDniAsignado.js');
const updateEstadoAsignadoInscripto = require('./updateEstadoAsignadoInscripto.js');
const validateLegajoAsignado = require('./validaLegajoAsignado.js');
const validateLegajoDisponibilidad = require('./validaLegajoDisponibilidad.js');

module.exports={
    getAllInscriptosMov,
    editInscriptoMov,
    updateIdVacanteGenerada,
    validateDniAsignado,
    updateEstadoAsignadoInscripto,
    validateLegajoAsignado,
    validateLegajoDisponibilidad
}