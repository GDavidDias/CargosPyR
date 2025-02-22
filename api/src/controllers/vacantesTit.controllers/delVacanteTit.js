const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //DESACTIVA UNA VACANTE AL ASIGNAR UNA OBSERVACION, 
    //EDITA UNA VACANTE EN SU CAMPO obs_desactiva
    const {idVacanteTit} = req.params;
    console.log('que trae idVacanteTit: ', idVacanteTit);

    const {obsDesactiva} = req.body;
    console.log('que trae observacion para desactivar una vacante obs_desactiva: ', obsDesactiva);
    try{

        const [result] = await pool.query(`UPDATE vacantes_tit SET obs_desactiva = '${obsDesactiva}'
            WHERE id_vacante_tit = ${idVacanteTit}`);

        console.log('que trae result delVacanteTit: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};