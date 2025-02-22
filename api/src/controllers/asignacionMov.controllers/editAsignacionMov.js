const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //MODIFICA UNA ASIGNACION AGREGANDO UNA FECHA DE MODIFICACION Y OBSERVACION
    const {idAsignacionMov} = req.params;
    console.log('que trae idAsignacionMov: ', idAsignacionMov);

    const{id_vacante_mov, id_inscripto_mov, id_estado_asignacion, datetime_actualizacion, observaciones} = req.body;
    console.log('que trae id_vacante_mov: ', id_vacante_mov);
    console.log('que trae id_inscripto_mov: ', id_inscripto_mov);
    console.log('que trae id_estado_asignacion: ', id_estado_asignacion);
    console.log('que trae datetime_actualizacion: ', datetime_actualizacion);
    console.log('que trae observaciones: ', observaciones);

    try{
        const [result] = await pool.query(`UPDATE asignacion_mov SET id_vacante_mov=${id_vacante_mov}, id_inscripto_mov=${id_inscripto_mov},  id_estado_asignacion=${id_estado_asignacion}, observaciones='${observaciones}', datetime_actualizacion='${datetime_actualizacion}'
            WHERE id_asignacion_mov = ${idAsignacionMov} ; `);

        console.log('que trae result editAsignacionMov: ', result);

        res.status(200).json({
            message: 'Asignacion Modificada con Exito',
            id_vacante_mov:id_vacante_mov,
            id_inscripto_mov:id_inscripto_mov,
            id_estado_asignacion:id_estado_asignacion, 
            datetime_actualizacion:datetime_actualizacion,
            observaciones:observaciones
        });

    }catch(error){
        res.status(400).send(error.message);
    }

}