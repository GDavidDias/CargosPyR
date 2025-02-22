const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODAS LAS VACANTES DE MOVIMIENTOS DISPONIBLES SEGUN UNA ESPECIDALIDAD y EL NIVEL INDICADO
    //EN EL LISTADO_VAC_MOV -> LO PASO POR BODY
    const {idEspecialidad} = req.params;
    console.log('que trae idEspecialidad: ', idEspecialidad);

    const{idListadoVacMov} = req.body;
    console.log('que trae idListadoVacMov: ', idListadoVacMov);
    
    try{
        //TRAE LAS VACANTES QUE NO TENGAN UNA FECHA DE ASIGNACION, SON LAS DISPONIBLES
        //TAMBIEN LAS QUE ESTEN ACTIVAS -> QUE vm.obs_desactiva sea NULL
        //WHERE am.datetime_asignacion IS NULL 
        //DESPUES VER SI SE IMPLEMENTA EL ESTADO DE ASIGNACION, SOLO TRAER COMO DISPONIBLES UNA SIGNACION RECHAZADA, YA QUE LAS ACEPTADAS ESTAN ASIGNADAS O LAS PENDIENTES ESTAN EN PROCESO DE ASIGNACION.

        const [result] = await pool.query(`SELECT vm.id_vacante_mov, vm.id_listado_vac_mov, vm.orden, vm.establecimiento, vm.obs_establecimiento, vm.region, vm.departamento, vm.localidad, vm.cargo, vm.turno, vm.modalidad, vm.cupof, vm.id_especialidad, vm.datetime_creacion, vm.obs_desactiva, vm.zona, am.datetime_asignacion , am.id_estado_asignacion
            FROM vacantes_mov AS vm
            LEFT JOIN asignacion_mov AS am ON vm.id_vacante_mov = am.id_vacante_mov
            WHERE am.datetime_asignacion IS NULL 
            AND (vm.obs_desactiva IS NULL OR vm.obs_desactiva = "")
            AND vm.id_listado_vac_mov=${idListadoVacMov} 
            AND vm.id_especialidad = ${idEspecialidad}`);

        console.log('que trae result getVacantesMovDispByEsp: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};