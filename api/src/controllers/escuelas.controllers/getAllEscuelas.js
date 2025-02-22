const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODAS LAS ESCUELAS
    try{
        const [result] = await pool.query(`SELECT e.id_escuela, e.numero_escuela, e.cue, e.nombre_escuela, e.direccion, e.localidad, e.departamento, e.modalidad, e.categoria, e.zona, e.link_map  FROM escuelas AS e`);

        console.log('que trae result getAllEscuelas: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};