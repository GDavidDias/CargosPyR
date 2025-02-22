const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //VALIDA QUE EL LEGAJO DE UN INSCRIPTO YA TENGA UNA ASIGNACION VALIDA.
    //QUE SEAN DEL NIVEL INDICADO EN EL LISTADO id_listado_inscriptos
    console.log('ingresa a validateLegajoAsignado');
    const {id_listado_inscriptos, legajoInscripto} = req.body;

    console.log('que trae id_listado_inscriptos: ', id_listado_inscriptos);
    console.log('que trae legajoInscripto: ', legajoInscripto);


    let armaquery=`SELECT im.id_inscriptos_mov, im.dni, im.apellido, im.nombre, im.total, im.legajo, im.id_tipo_inscripto, ti.descripcion AS tipoinscripto, im.id_listado_inscriptos, li.descripcion, am2.id_vacante_mov AS vacante_asignada, im.id_vacante_generada_cargo_actual, vm.establecimiento AS vac_establecimiento, vm.obs_establecimiento AS vac_obs_establecimiento, vm.region AS vac_region, vm.departamento AS vac_departamento, vm.localidad AS vac_localidad, vm.cargo AS vac_cargo, vm.turno AS vac_turno, vm.modalidad AS vac_modalidad, vm.cupof AS vac_cupof
            FROM inscriptos_mov AS im
            LEFT JOIN tipo_inscripto AS ti ON im.id_tipo_inscripto = ti.id_tipo_inscripto
            LEFT JOIN listado_inscriptos AS li ON im.id_listado_inscriptos = li.id_listado_inscriptos
            JOIN (SELECT am.id_inscripto_mov, am.id_vacante_mov FROM asignacion_mov AS am WHERE am.obs_desactiva IS NULL) AS am2 ON im.id_inscriptos_mov = am2.id_inscripto_mov
            LEFT JOIN vacantes_mov AS vm ON am2.id_vacante_mov = vm.id_vacante_mov

            `;

    armaquery += `WHERE im.id_listado_inscriptos = ${id_listado_inscriptos}
                AND im.legajo = ${legajoInscripto}
            `;            

    try{
        const [result] = await pool.query(`${armaquery}`);

        console.log('que trae result validateLegajoAsignado: ', result);


        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};