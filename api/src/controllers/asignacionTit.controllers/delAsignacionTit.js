const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //DESACTIVA UNA ASIGNACION AL ACTUALIZAR UNA OBSERVACION, ELIMINAR id_vacante y id_inscripto y guardarlo en observaciones
    //EDITA UNA ASIGNACION EN SU CAMPO obs_desactiva
    const {idAsignacionTit} = req.params;
    console.log('que trae idAsignacionTit: ', idAsignacionTit);

    const {obsDesactiva} = req.body;
    console.log('que trae observacion para desactivar una vacante obs_desactiva: ', obsDesactiva);

    try{

        const [result] = await pool.query(`UPDATE asignacion_tit SET obs_desactiva = '${obsDesactiva}'
            WHERE id_asignacion_tit = ${idAsignacionTit}`);

        console.log('que trae result delAsignacionTit: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};