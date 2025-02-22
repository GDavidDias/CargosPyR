const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODAS LAS VACANTES DE TITULARIZACION ASIGNADAS 
    //SEGUN EL NIVEL INDICADO EN EL ID_LISTADO_VAC_MOV -> LO PASO POR BODY
    const{idListadoVacTit} = req.body;
    console.log('que trae idListadoVacTit: ', idListadoVacTit);

    try{
        // TRAE LAS ASIGNACIONES REALIZADAS, POR MEDIO DE LA CONSULTA A LAS 
        // VACANTES QUE SI TENGAN UNA FECHA DE ASIGNACION, SON LAS ASIGNADAS
        //TAMBIEN LAS QUE ESTEN ACTIVAS -> QUE vt.obs_desactiva sea NULL
        //WHERE at.datetime_asignacion IS NOT NULL 
        //y que el subselect de asignacion_tit solo traiga las asignaciones ACTIVAS -> at.obs_desactiva IS NULL
        //DESPUES VER SI SE IMPLEMENTA EL ESTADO DE ASIGNACION, SOLO TRAER COMO DISPONIBLES UNA SIGNACION RECHAZADA, YA QUE LAS ACEPTADAS ESTAN ASIGNADAS O LAS PENDIENTES ESTAN EN PROCESO DE ASIGNACION.

        const [result] = await pool.query(`SELECT  vt.id_listado_vac_tit, at2.datetime_asignacion , at2.id_estado_asignacion, at2.id_inscripto_tit, it.nombre, it.apellido, it.dni, it.total, vt.id_vacante_tit, vt.orden, vt.cargo AS cargo_toma, vt.nro_establecimiento AS nro_escuela_toma, vt.nombre_establecimiento, vt.region, vt.departamento, vt.localidad, vt.turno, vt.modalidad, vt.cupof, vt.id_especialidad, vt.datetime_creacion, vt.obs_desactiva, vt.zona, vt.resolucion
            FROM vacantes_tit AS vt
            LEFT JOIN (SELECT at.id_vacante_tit, at.datetime_asignacion , at.id_estado_asignacion, at.id_inscripto_tit FROM asignacion_tit AS at WHERE at.obs_desactiva IS NULL) AS at2 ON vt.id_vacante_tit = at2.id_vacante_tit
            LEFT JOIN inscriptos_tit AS it ON at2.id_inscripto_tit = it.id_inscriptos_tit
            WHERE at2.datetime_asignacion IS NOT NULL 
            AND (vt.obs_desactiva IS NULL OR vt.obs_desactiva = "")
            AND vt.id_listado_vac_tit=${idListadoVacTit}
            ORDER BY vt.id_vacante_tit ASC`);

        console.log('que trae result getRepoASignacionesRealizadas: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};