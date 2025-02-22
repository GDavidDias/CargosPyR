const pool = require('../../database/connection.js');

module.exports = async(req, res)=>{
    //CREA UNA ASIGNACION DE UN INSCRIPTO A UNA VACANTE
    //EN UNA PRIMERA INSTANCIA SOLO SE CREA LA ASINGACION
    //VER SI SE DEBE MODIFICAR LA ASIGNACION
    const{id_vacante_mov, id_inscripto_mov, datetime_asignacion, id_estado_asignacion} = req.body;
    
    console.log('que trae id_vacante_mov: ', id_vacante_mov);
    console.log('que trae id_inscripto_mov: ', id_inscripto_mov);
    console.log('que trae datetime_asignacion: ', datetime_asignacion);
    console.log('que trae id_estado_asignacion: ', id_estado_asignacion);

    try{
        const result = await pool.query(`INSERT INTO asignacion_mov(id_vacante_mov, id_inscripto_mov, datetime_asignacion, id_estado_asignacion) VALUES(${id_vacante_mov}, ${id_inscripto_mov}, '${datetime_asignacion}', ${id_estado_asignacion}); `);

        const [rows] = await pool.query('SELECT LAST_INSERT_ID() AS id_asignacion_mov');
        const id_asignacion_mov = rows[0].id_asignacion_mov;

        console.log(result);

        res.status(200).json({
            message:'Asignacion Creada',
            id_asignacion_mov:id_asignacion_mov,
            id_vacante_mov:id_vacante_mov,
            id_inscripto_mov:id_inscripto_mov,
            datetime_asignacion:datetime_asignacion,
            id_estado_asignacion:id_estado_asignacion
        });

    }catch(error){
        res.status(400).send(error.message);
    }



}
