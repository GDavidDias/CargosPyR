const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODAS LAS VACANTES DE TITULARIZACION DISPONIBLES 
    //SEGUN EL NIVEL INDICADO EN EL ID_LISTADO_VAC_MOV -> LO PASO POR BODY
    const{idListadoVacTit, limit, page, filtroBusqueda, filtroEspecialidad, orderBy} = req.body;
    console.log('que trae idListadoVacTit: ', idListadoVacTit);
    console.log('que trae limit: ', limit);
    console.log('que trae page: ', page);
    console.log('que trae filtroBusqueda: ', filtroBusqueda);
    console.log('que trae filtroEspecialidad: ', filtroEspecialidad);
    console.log('que trae orderBy: ', orderBy);
    //console.log('que trae typeOrder: ', typeOrder);

    const offset = (page-1)*limit;

    let armaquery=`SELECT vt.id_vacante_tit, vt.id_listado_vac_tit, vt.orden, vt.nro_establecimiento, vt.nombre_establecimiento, vt.region, vt.departamento, vt.localidad, vt.cargo, vt.turno, vt.modalidad, vt.cupof, vt.id_especialidad, vt.datetime_creacion, vt.obs_desactiva, vt.zona, vt.resolucion, at2.datetime_asignacion , at2.id_estado_asignacion
            FROM vacantes_tit AS vt
            LEFT JOIN (SELECT at.id_vacante_tit, at.datetime_asignacion , at.id_estado_asignacion FROM asignacion_tit AS at WHERE at.obs_desactiva IS NULL) AS at2 ON vt.id_vacante_tit = at2.id_vacante_tit
            WHERE at2.datetime_asignacion IS NULL 
            AND (vt.obs_desactiva IS NULL OR vt.obs_desactiva = "")
            AND vt.id_listado_vac_tit=${idListadoVacTit} 
            `;


    if(filtroEspecialidad && filtroEspecialidad!=''){
        armaquery += ` AND vt.id_especialidad IN(${filtroEspecialidad}) `
    };

    if(filtroBusqueda && filtroBusqueda!=''){
        armaquery+=` AND (LOWER(vt.nro_establecimiento) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                            OR LOWER(vt.nombre_establecimiento) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                            OR LOWER(vt.localidad) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                            OR LOWER(vt.modalidad) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                            OR LOWER(vt.cupof) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                            OR LOWER(vt.region) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                    ) `
    };
    
    // if(filtroBusqueda && filtroBusqueda!=''){
    //     armaquery+=` AND (LOWER(vm.establecimiento) LIKE '%${filtroBusqueda.toLowerCase()}%' 
    //                         OR LOWER(vm.obs_establecimiento) LIKE '%${filtroBusqueda.toLowerCase()}%' 
    //                         OR LOWER(vm.departamento) LIKE '%${filtroBusqueda.toLowerCase()}%' 
    //                         OR LOWER(vm.localidad) LIKE '%${filtroBusqueda.toLowerCase()}%' 
    //                         OR LOWER(vm.cargo) LIKE '%${filtroBusqueda.toLowerCase()}%' 
    //                         OR LOWER(vm.modalidad) LIKE '%${filtroBusqueda.toLowerCase()}%' 
    //                         OR LOWER(vm.cupof) LIKE '%${filtroBusqueda.toLowerCase()}%' 
    //                 ) `
    // };

    // if(orderBy && orderBy!=''){
    //     armaquery += ` ORDER BY vm.${orderBy} ${typeOrder}`
    // }else{

    //     armaquery+= ` ORDER BY vm.id_vacante_mov ASC`;
    // }

    armaquery+= ` ORDER BY vt.id_vacante_tit ASC`


    try{
        //TRAE LAS VACANTES QUE NO TENGAN UNA FECHA DE ASIGNACION, SON LAS DISPONIBLES
        //TAMBIEN LAS QUE ESTEN ACTIVAS -> QUE vm.obs_desactiva sea NULL
        //WHERE am.datetime_asignacion IS NULL 
        //y que el subselect de asignacion_mov solo traiga las asignaciones ACTIVAS -> am.obs_desactiva IS NULL
        //DESPUES VER SI SE IMPLEMENTA EL ESTADO DE ASIGNACION, SOLO TRAER COMO DISPONIBLES UNA SIGNACION RECHAZADA, YA QUE LAS ACEPTADAS ESTAN ASIGNADAS O LAS PENDIENTES ESTAN EN PROCESO DE ASIGNACION.

        const [result] = await pool.query(`${armaquery} LIMIT ${limit} OFFSET ${offset}`);

        console.log('que trae result getVacantesDispTit: ', result);

        const [totalRows] = await pool.query(`SELECT COUNT(*) AS count FROM (${armaquery}) AS vacantes`);

        const totalPages = Math.ceil(totalRows[0]?.count/limit);
        const totalItems = totalRows[0]?.count;

        res.status(200).json({
            result:result,
            paginacion:{
                page:page,
                limit:limit,
                totalPages:totalPages,
                totalItems:totalItems
            }
        });
        
    }catch(error){
        res.status(400).send(error.message);
    }

};