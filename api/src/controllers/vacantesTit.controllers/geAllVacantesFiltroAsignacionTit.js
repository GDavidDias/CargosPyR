const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODAS LAS VACANTES DE TITULARIZACION SEGUN EL NIVEL INDICADO EN EL LISTADO_VAC_TIT
    const{idListadoVacTit,filtroAsignacion} = req.body;
    console.log('que trae idListadoVacTit: ', idListadoVacTit);
    console.log('que trae filtroAsignacion: ', filtroAsignacion);

    let armaquery=`SELECT vt.id_vacante_tit, vt.id_listado_vac_tit, vt.orden, vt.nro_establecimiento, vt.nombre_establecimiento, vt.region, vt.departamento, vt.localidad, vt.cargo, vt.turno, vt.modalidad, vt.cupof, vt.id_especialidad, vt.datetime_creacion, vt.obs_desactiva, vt.zona, vt.resolucion, at2.datetime_asignacion , at2.id_inscripto_tit, it.dni, it.apellido, it.nombre, it.total
            FROM vacantes_tit AS vt
            LEFT JOIN (SELECT at.id_vacante_tit, at.datetime_asignacion , at.id_estado_asignacion FROM asignacion_tit AS at WHERE at.obs_desactiva IS NULL) AS at2 ON vt.id_vacante_tit = at2.id_vacante_tit
            LEFT JOIN inscriptos_tit AS it ON at2.id_inscripto_tit = it.id_inscriptos_tit
            WHERE (vt.obs_desactiva IS NULL OR vt.obs_desactiva = "")
            AND vt.id_listado_vac_tit=${idListadoVacTit}
            `;

    
    if(filtroAsignacion==='asignadas'){
        armaquery+=` AND at2.datetime_asignacion IS NOT NULL`;
    }else if(filtroAsignacion==='disponibles'){
        armaquery+=` AND at2.datetime_asignacion IS NULL`;
    };

    armaquery+= ` ORDER BY vt.id_vacante_tit ASC`

    try{

        const [result] = await pool.query(`${armaquery} `);

        console.log('que trae result getAllVacantesFiltroAsignacionTit: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};