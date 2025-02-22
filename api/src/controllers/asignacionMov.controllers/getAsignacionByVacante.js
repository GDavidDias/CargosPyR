const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE DATOS DE ASIGNACION DE UNA VACANTE con el id_vacante
    const {idVacante} = req.params;
    console.log('que trae idVacante: ', idVacante);

// +------------------------+--------------+------+-----+---------+----------------+
// | Field                  | Type         | Null | Key | Default | Extra          |
// +------------------------+--------------+------+-----+---------+----------------+
// | id_asignacion_mov      | int          | NO   | PRI | NULL    | auto_increment |
// | id_vacante_mov         | int          | YES  |     | NULL    |                |
// | id_inscripto_mov       | int          | YES  |     | NULL    |                |
// | datetime_asignacion    | datetime     | YES  |     | NULL    |                |
// | id_estado_asignacion   | int          | YES  |     | NULL    |                |
// | observaciones          | varchar(250) | YES  |     | NULL    |                |
// | datetime_actualizacion | datetime     | YES  |     | NULL    |                |
// +------------------------+--------------+------+-----+---------+----------------+
    
    try{

        const [result] = await pool.query(`SELECT am.id_asignacion_mov, am.id_vacante_mov, am.id_inscripto_mov, am.datetime_asignacion, im.apellido, im.nombre, im.dni
            FROM asignacion_mov AS am
            LEFT JOIN inscriptos_mov AS im ON am.id_inscripto_mov = im.id_inscriptos_mov
            WHERE am.id_vacante_mov = ${idVacante}
            AND am.obs_desactiva IS NULL
            `);

        console.log('que trae result getAsignacionByVacante: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};