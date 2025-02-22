const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODOS LAS ESPECIALIDADES DE TABLA ESPECIALIDAD
    try{
        const [result] = await pool.query(`SELECT id_especialidad, descripcion, abreviatura, activo_visor_tit
            FROM especialidad`);

        //console.log('que trae result getEspecidalidades: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};