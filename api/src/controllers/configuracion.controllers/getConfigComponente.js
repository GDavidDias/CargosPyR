const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE DATOS DE TABLA CONFIGURACION
    try{
        const [result] = await pool.query(`SELECT id_component, componente, descripcion, active
            FROM config_component_active`);

        console.log('que trae result getConfigComponente: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};