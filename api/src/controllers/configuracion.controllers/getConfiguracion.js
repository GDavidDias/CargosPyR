const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE DATOS DE TABLA CONFIGURACION
    try{
        const [result] = await pool.query(`SELECT id_configuracion, id_nivel, id_listado_inscriptos_mov, id_listado_vacantes_mov, id_listado_inscriptos_tit, id_listado_vacantes_tit, id_listado_inscriptos_mov_compara, id_listado_inscriptos_pr, id_listado_vacantes_pr
            FROM configuracion`);

        console.log('que trae result getConfiguracion: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};