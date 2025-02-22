const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODOS LOS INSCRIPTOS DE LA TABLA inscriptos_tit
    //QUE SEAN DEL NIVEL INDICADO EN EL LISTADO id_listado_inscriptos
    console.log('ingresa a getReporteEstadoInscriptosTit');
    const {id_listado_inscriptos,limit,page} = req.body;

    console.log('que trae id_listado_inscriptos: ', id_listado_inscriptos);
    console.log('que trae limit: ', limit);
    console.log('que trae page: ', page);

    const offset = (page-1)*limit;

    let armaquery=`SELECT it.id_inscriptos_tit, it.dni, it.apellido, it.nombre, it.total, it.orden, it.id_especialidad, e.descripcion AS especialidad, it.id_listado_inscriptos, li.descripcion, at2.id_vacante_tit AS vacante_asignada, it.id_estado_inscripto, ei.descripcion AS descripcion_estado_inscripto
            FROM inscriptos_tit AS it
            LEFT JOIN especialidad AS e ON it.id_especialidad = e.id_especialidad 
            LEFT JOIN listado_inscriptos AS li ON it.id_listado_inscriptos = li.id_listado_inscriptos
            LEFT JOIN estado_inscripto AS ei ON it.id_estado_inscripto = ei.id_estado_inscripto
            LEFT JOIN (SELECT at.id_inscripto_tit, at.id_vacante_tit FROM asignacion_tit AS at WHERE at.obs_desactiva IS NULL) AS at2 ON it.id_inscriptos_tit = at2.id_inscripto_tit

            WHERE it.id_listado_inscriptos = ${id_listado_inscriptos}
                        
            `;


    armaquery+=` ORDER BY it.id_inscriptos_tit ASC `

    try{
        const [result] = await pool.query(`${armaquery} LIMIT ${limit} OFFSET ${offset}`);

        console.log('que trae result getReporteEstadoInscriptosTit: ', result);

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