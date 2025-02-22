const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODOS LOS INSCRIPTOS DE LA TABLA inscriptos_pr
    //QUE SEAN DEL NIVEL INDICADO EN EL LISTADO id_listado_inscriptos
    console.log('ingresa a getAllInscriptosPyR');
    const {id_listado_inscriptos,limit,page,filtroAsignacion,filtroEspecialidad,filtroBusqueda} = req.body;

    console.log('que trae id_listado_inscriptos: ', id_listado_inscriptos);
    console.log('que trae limit: ', limit);
    console.log('que trae page: ', page);
    console.log('que trae filtroAsignacion: ', filtroAsignacion);
    console.log('que trae filtroEspecialidad: ', filtroEspecialidad);
    console.log('que trae filtroBusqueda: ', filtroBusqueda);

    const offset = (page-1)*limit;


    let armaquery=`SELECT ipr.id_inscriptos_pr, ipr.dni, ipr.apellido, ipr.nombre, ipr.total, ipr.orden, ipr.id_especialidad, e.descripcion AS especialidad, e.abreviatura AS abreviatura_especialidad, ipr.id_listado_inscriptos, li.descripcion, apr2.id_vacante_pr AS vacante_asignada, ipr.id_estado_inscripto, ei.descripcion AS descripcion_estado_inscripto, ipr.observaciones
            FROM inscriptos_pr AS ipr
            LEFT JOIN especialidad AS e ON ipr.id_especialidad = e.id_especialidad 
            LEFT JOIN listado_inscriptos AS li ON ipr.id_listado_inscriptos = li.id_listado_inscriptos
            LEFT JOIN estado_inscripto AS ei ON ipr.id_estado_inscripto = ei.id_estado_inscripto
            LEFT JOIN (SELECT apr.id_inscripto_pr, apr.id_vacante_pr FROM asignacion_pr AS apr WHERE apr.obs_desactiva IS NULL) AS apr2 ON ipr.id_inscriptos_pr = apr2.id_inscripto_pr

            WHERE ipr.id_listado_inscriptos = ${id_listado_inscriptos}
                        
            `;

    if(filtroAsignacion==='asignados'){
        armaquery+=` AND apr2.id_vacante_pr IS NOT NULL `;
    }else if(filtroAsignacion==='sinasignar'){
        armaquery+=` AND apr2.id_vacante_pr IS NULL `;
    };

    if(filtroEspecialidad && filtroEspecialidad!=''){
        armaquery+=` AND ipr.id_especialidad IN (${filtroEspecialidad}) `
    }

    if(filtroBusqueda && filtroBusqueda!=''){
        armaquery+=` AND (LOWER(ipr.apellido) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                        OR LOWER(ipr.nombre) LIKE '%${filtroBusqueda.toLowerCase()}%'
                        OR LOWER(ipr.dni) LIKE '%${filtroBusqueda.toLowerCase()}%'
                        OR LOWER(e.descripcion) LIKE '%${filtroBusqueda.toLowerCase()}%'
                        )`
    };

    armaquery+=` ORDER BY ipr.id_inscriptos_pr ASC `

    console.log('como armaquery en getAllInscriptosPyR: ', armaquery);

    try{
        const [result] = await pool.query(`${armaquery} LIMIT ${limit} OFFSET ${offset}`);

        //console.log('que trae result getAllInscriptosPyR: ', result);

        const [totalRows]= await pool.query(`SELECT COUNT(*) AS count FROM (${armaquery}) AS inscriptos`)

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