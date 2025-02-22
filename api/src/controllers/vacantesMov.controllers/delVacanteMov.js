const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //DESACTIVA UNA VACANTE AL ASIGNAR UNA OBSERVACION, 
    //EDITA UNA VACANTE EN SU CAMPO obs_desactiva
    const {idVacanteMov} = req.params;
    console.log('que trae idVacanteMov: ', idVacanteMov);

    const {obsDesactiva} = req.body;
    console.log('que trae observacion para desactivar una vacante obs_desactiva: ', obsDesactiva);
    try{
        //TRAE LAS VACANTES QUE NO TENGAN UNA FECHA DE ASIGNACION, SON LAS DISPONIBLES
        //WHERE am.datetime_asignacion IS NULL 
        //DESPUES VER SI SE IMPLEMENTA EL ESTADO DE ASIGNACION, SOLO TRAER COMO DISPONIBLES UNA SIGNACION RECHAZADA, YA QUE LAS ACEPTADAS ESTAN ASIGNADAS O LAS PENDIENTES ESTAN EN PROCESO DE ASIGNACION.

        const [result] = await pool.query(`UPDATE vacantes_mov SET obs_desactiva = '${obsDesactiva}'
            WHERE id_vacante_mov = ${idVacanteMov}`);

        console.log('que trae result delVacanteMov: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};