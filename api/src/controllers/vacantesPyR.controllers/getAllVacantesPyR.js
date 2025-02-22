const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODAS LAS VACANTES DE PROVISIONALES Y REEMPLAZANTES SEGUN EL NIVEL INDICADO EN EL LISTADO_VAC_PYR
    const{idListadoVacPyR,limit,page,filtroAsignacion,filtroEspecialidad,filtroBusqueda, filtroRegion, filtroModalidad} = req.body;
    console.log('que trae idListadoVacPyR: ', idListadoVacPyR);
    console.log('que trae limit: ', limit);
    console.log('que trae page: ', page);
    console.log('que trae filtroAsignacion: ', filtroAsignacion);
    console.log('que trae filtroEspecialidad: ', filtroEspecialidad);
    console.log('que trae filtroBusqueda: ', filtroBusqueda);
    console.log('que trae filtroRegion: ', filtroRegion);
    console.log('que trae filtroModalidad: ', filtroModalidad);

    const offset = (page-1)*limit;

    let armaquery=`SELECT vpr.id_vacante_pr, vpr.id_listado_vac_pr, vpr.orden, vpr.nro_establecimiento, vpr.nombre_establecimiento, vpr.region, vpr.departamento, vpr.localidad, vpr.cargo, vpr.turno, vpr.modalidad, vpr.cupof, vpr.id_especialidad, vpr.datetime_creacion, vpr.obs_desactiva, vpr.zona, vpr.resolucion, apr2.datetime_asignacion , apr2.id_estado_asignacion, e.cue, e.link_map
            FROM vacantes_pr AS vpr
            LEFT JOIN (SELECT apr.id_vacante_pr, apr.datetime_asignacion , apr.id_estado_asignacion FROM asignacion_pr AS apr WHERE apr.obs_desactiva IS NULL) AS apr2 ON vpr.id_vacante_pr = apr2.id_vacante_pr
            LEFT JOIN escuelas AS e ON vpr.nro_establecimiento = e.numero_escuela
            WHERE (vpr.obs_desactiva IS NULL OR vpr.obs_desactiva = "")
            AND vpr.id_listado_vac_pr=${idListadoVacPyR}
            `;

    if(filtroEspecialidad && filtroEspecialidad!=''){
        armaquery += ` AND vpr.id_especialidad IN(${filtroEspecialidad}) `
    };

    if(filtroAsignacion==='asignadas'){
        armaquery+=` AND apr2.datetime_asignacion IS NOT NULL`;
    }else if(filtroAsignacion==='disponibles'){
        armaquery+=` AND apr2.datetime_asignacion IS NULL`;
    };
    
    {/**
        if(filtroBusqueda && filtroBusqueda!=''){
            armaquery+=` AND (LOWER(vt.nro_establecimiento) LIKE '%${filtroBusqueda.toLowerCase()}%' 
            OR LOWER(vt.nombre_establecimiento) LIKE '%${filtroBusqueda.toLowerCase()}%' 
            OR LOWER(vt.departamento) LIKE '%${filtroBusqueda.toLowerCase()}%' 
            OR LOWER(vt.localidad) LIKE '%${filtroBusqueda.toLowerCase()}%' 
            OR LOWER(vt.cargo) LIKE '%${filtroBusqueda.toLowerCase()}%' 
            ) `
        };
        */}

    if(filtroBusqueda && filtroBusqueda!=''){
        if(!isNaN(filtroBusqueda)){
            //SI ES UN NUMERO BUSCARLO EN NUMERO DE ESTABLECIMIENTO
            armaquery+=` AND (LOWER(vpr.nro_establecimiento) LIKE '${filtroBusqueda.toLowerCase()}%' 
            ) `

        }else{
            //SI NO ES UN  NUMERO, APLICO BUSQUEDAS EN OTROS CAMPOS
            armaquery+=` AND (LOWER(vpr.nombre_establecimiento) LIKE '%${filtroBusqueda.toLowerCase()}%' 
            OR LOWER(vpr.departamento) LIKE '%${filtroBusqueda.toLowerCase()}%' 
            OR LOWER(vpr.localidad) LIKE '%${filtroBusqueda.toLowerCase()}%' 
            OR LOWER(vpr.cargo) LIKE '%${filtroBusqueda.toLowerCase()}%' 
            ) `
        }
    };
    
    /**Filtro de Region, debe ser exacto no traer I, II, III, etc si busco I */
    if(filtroRegion && filtroRegion!=''){
        armaquery += ` AND (LOWER(vpr.region) LIKE '${filtroRegion.toLowerCase()}' ) `
    };

    /**Filtro de Modalidad, debe ser exacto */
    if(filtroModalidad && filtroModalidad!=''){
        armaquery += ` AND (LOWER(vpr.modalidad) LIKE '${filtroModalidad.toLowerCase()}' ) `
    };

    if(filtroBusqueda && filtroBusqueda!=''){
        if(!isNaN(filtroBusqueda)){
            armaquery+= ` ORDER BY vpr.nro_establecimiento ASC`
        }else{
            armaquery+= ` ORDER BY vpr.id_vacante_pr ASC`    
        }
    }else{
        armaquery+= ` ORDER BY vpr.id_vacante_pr ASC`
    }

    try{
        console.log('como ARMA QUERY getAllVacantesPyR: ', armaquery);

        const [result] = await pool.query(`${armaquery} LIMIT ${limit} OFFSET ${offset}`);

        console.log('que trae result getAllVacantesPyR: ', result);

        const [totalRows]= await pool.query(`SELECT COUNT(*) AS count FROM (${armaquery}) AS vacantes`)

        const totalPages= Math.ceil(totalRows[0]?.count/limit);
        const totalItems=totalRows[0]?.count;

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