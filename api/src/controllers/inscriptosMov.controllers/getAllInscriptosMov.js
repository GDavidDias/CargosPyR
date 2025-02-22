const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODOS LOS INSCRIPTOS DE LA TABLA inscriptos_mov
    //QUE SEAN DEL NIVEL INDICADO EN EL LISTADO id_listado_inscriptos
    console.log('ingresa a getAllInscriptosMov');
    const {id_listado_inscriptos,limit,page,idTipoInscripto,filtroAsignacion,filtroBusqueda,idListadoInscriptosCompara,idEspecialidadLuom} = req.body;

    console.log('que trae id_listado_inscriptos: ', id_listado_inscriptos);
    console.log('que trae limit: ', limit);
    console.log('que trae page: ', page);
    console.log('que trae idTipoInscripto: ', idTipoInscripto);
    console.log('que trae filtroAsignacion: ', filtroAsignacion);
    console.log('que trae filtroBusqueda: ', filtroBusqueda);
    //este idListadoInscriptosCompara, sirve para comparar contra que listado, el dni de un docente ya tiene asignado un cargo.
    //traigo todas las asignaciones realizadas con ese idListadoInscriptosCompara y con su dni puedo buscar si existe en el listado de id_listado_inscriptos
    console.log('que trae idListadoInscriptosCompara: ', idListadoInscriptosCompara);

    //Filtro Especialidad Luom
    console.log('que trae idEspecialidadLuom: ', idEspecialidadLuom);


    const offset = (page-1)*limit;


    let armaquery=`SELECT im.id_inscriptos_mov, im.cargo_actual, im.turno_actual, im.cargo_solicitado, im.dni, im.apellido, im.nombre, im.observacion, im.total, im.orden, im.nro_escuela, im.legajo, im.id_especialidad, e.descripcion AS especialidad, im.id_tipo_inscripto, ti.descripcion AS tipoinscripto, im.id_listado_inscriptos, li.descripcion, am2.id_vacante_mov AS vacante_asignada, im.id_vacante_generada_cargo_actual, im.id_estado_inscripto, im.genera_vacante, ei.descripcion AS estado_inscripto, imCompara.legajo AS legajoEnOtroNivel
            FROM inscriptos_mov AS im
            LEFT JOIN especialidad AS e ON im.id_especialidad = e.id_especialidad 
            LEFT JOIN tipo_inscripto AS ti ON im.id_tipo_inscripto = ti.id_tipo_inscripto
            LEFT JOIN listado_inscriptos AS li ON im.id_listado_inscriptos = li.id_listado_inscriptos
            LEFT JOIN estado_inscripto AS ei ON im.id_estado_inscripto = ei.id_estado_inscripto
            LEFT JOIN (SELECT am.id_inscripto_mov, am.id_vacante_mov FROM asignacion_mov AS am WHERE am.obs_desactiva IS NULL) AS am2 ON im.id_inscriptos_mov = am2.id_inscripto_mov

            `;

    //arma subonsulta para saber si se encuentra en otro listado con alguna asignacion.
    // if(idListadoInscriptosCompara && idListadoInscriptosCompara!=''){
    //     armaquery += ` LEFT JOIN (SELECT DISTINCT im2.dni
    //                      FROM inscriptos_mov AS im2 
    //                      JOIN (SELECT am3.id_inscripto_mov 
    //                                 FROM asignacion_mov AS am3 
    //                                 WHERE am3.obs_desactiva IS NULL) AS am4 ON im2.id_inscriptos_mov = am4.id_inscripto_mov
    //                      WHERE im2.id_listado_inscriptos = ${idListadoInscriptosCompara} ) AS imCompara ON im.dni = imCompara.dni
    //                     `;
    // };

    //Subconsulta que compara si el legajo ya tomo cargo en otro nivel
    if(idListadoInscriptosCompara && idListadoInscriptosCompara!=''){
        armaquery += ` LEFT JOIN (SELECT DISTINCT im2.legajo
                         FROM inscriptos_mov AS im2 
                         JOIN (SELECT am3.id_inscripto_mov 
                                    FROM asignacion_mov AS am3 
                                    WHERE am3.obs_desactiva IS NULL) AS am4 ON im2.id_inscriptos_mov = am4.id_inscripto_mov
                         WHERE im2.id_listado_inscriptos = ${idListadoInscriptosCompara} ) AS imCompara ON im.legajo = imCompara.legajo
                        `;
    };



    armaquery += `WHERE im.id_listado_inscriptos = ${id_listado_inscriptos}
            AND im.id_tipo_inscripto IN (${idTipoInscripto})            
            `;

    if(filtroAsignacion==='asignados'){
        armaquery+=` AND am2.id_vacante_mov IS NOT NULL `;
    }else if(filtroAsignacion==='sinasignar'){
        armaquery+=` AND am2.id_vacante_mov IS NULL `;
    };

    if(filtroBusqueda && filtroBusqueda!=''){
        armaquery+=` AND (LOWER(im.apellido) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                        OR LOWER(im.nombre) LIKE '%${filtroBusqueda.toLowerCase()}%'
                        OR LOWER(im.dni) LIKE '%${filtroBusqueda.toLowerCase()}%'
                        OR LOWER(im.legajo) LIKE '%${filtroBusqueda.toLowerCase()}%'
                        OR LOWER(im.cargo_actual) LIKE '%${filtroBusqueda.toLowerCase()}%'
                        OR LOWER(im.cargo_solicitado) LIKE '%${filtroBusqueda.toLowerCase()}%'
                        OR LOWER(im.nro_escuela) LIKE '%${filtroBusqueda.toLowerCase()}%'
                        )`
    };

    //Filtro Luom Especialidad
    if(idEspecialidadLuom && idEspecialidadLuom!=''){
        armaquery+=` AND im.id_especialidad = ${idEspecialidadLuom} `;
    };

    armaquery+=` ORDER BY im.id_inscriptos_mov ASC `

    try{
        const [result] = await pool.query(`${armaquery} LIMIT ${limit} OFFSET ${offset}`);

        console.log('que trae result getAllInscriptosMov: ', result);

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