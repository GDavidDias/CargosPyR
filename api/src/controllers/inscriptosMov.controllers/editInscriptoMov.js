const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //MODIFICA UN INSCRIPTO
    const{idInscriptoMov} = req.params;
    console.log('que trae idInscriptoMov: ', idInscriptoMov);

    const{cargo_actual, turno_actual, cargo_solicitado, dni, apellido, nombre, observacion, total, orden, nro_escuela, legajo, id_especialidad, id_tipo_inscripto, id_listado_inscriptos} = req.body;
    console.log('que trae cargo_actual: ', cargo_actual);
    console.log('que trae turno_actual: ', turno_actual);
    console.log('que trae cargo_solicitado: ', cargo_solicitado);
    console.log('que trae dni: ', dni);
    console.log('que trae apellido: ', apellido);
    console.log('que trae nombre: ', nombre);
    console.log('que trae observacion: ', observacion);
    console.log('que trae total: ', total);
    console.log('que trae orden: ', orden);
    console.log('que trae nro_escuela: ', nro_escuela);
    console.log('que trae legajo: ', legajo);
    console.log('que trae id_especialidad: ', id_especialidad);
    console.log('que trae id_tipo_inscripto: ', id_tipo_inscripto);
    console.log('que trae id_listado_inscriptos: ', id_listado_inscriptos);

    try{
        const [result] = await pool.query(`UPDATE inscriptos_mov SET cargo_actual='${cargo_actual}', turno_actual='${turno_actual}', cargo_solicitado='${cargo_solicitado}', dni='${dni}', apellido='${apellido}', nombre='${nombre}', observacion='${observacion}', total='${total}', orden=${orden}, nro_escuela='${nro_escuela}', legajo=${legajo}, id_especialidad=${id_especialidad}, id_tipo_inscripto=${id_tipo_inscripto}, id_listado_inscriptos=${id_listado_inscriptos}
            WHERE id_inscriptos_mov = ${idInscriptoMov} `);
        
        console.log('que trae result editInscriptoMov: ', result);

        res.status(200).json({
            message:'Inscriptos de Movimientos Actualizada',
            cargo_actual:cargo_actual, 
            turno_actual:turno_actual, 
            cargo_solicitado:cargo_solicitado, 
            dni:dni, 
            apellido:apellido, 
            nombre:nombre, 
            observacion:observacion, 
            total:total, 
            orden:orden, 
            nro_escuela:nro_escuela, 
            legajo:legajo, 
            id_especialidad:id_especialidad, 
            id_tipo_inscripto:id_tipo_inscripto, 
            id_listado_inscriptos:id_listado_inscriptos
        });

    }catch(error){
        res.status(400).send(error.message);
    }


};