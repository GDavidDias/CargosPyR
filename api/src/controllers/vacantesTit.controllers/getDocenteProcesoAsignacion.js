const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE EL DOCENTE PROXIMO EN EL ORDEN DE INSCRIPCION QUE ESTA EN PROCESO DE ASIGNACION
    const {id_listado, id_especialidad} = req.body;
    console.log('que tiene id_listado: ', id_listado);
    console.log('que tiene id_especialidad: ', id_especialidad);


    try{
        //TRAE EL DOCENTE PROXIMO EN EL ORDEN DE INSCRIPCION QUE ESTA EN PROCESO DE ASIGNACION
        let armaquery = `
                SELECT im.id_inscriptos_tit, im.apellido, im.orden
                FROM inscriptos_tit im
                WHERE im.id_listado_inscriptos = ${id_listado}  AND im.id_especialidad = ${id_especialidad}
                AND im.orden < (
                        SELECT orden
                        FROM inscriptos_tit
                        WHERE id_listado_inscriptos = ${id_listado}
                        AND id_inscriptos_tit = (SELECT MAX(id_inscriptos_tit) 
                                                FROM inscriptos_tit 
                                                WHERE id_listado_inscriptos = ${id_listado} 
                                                AND id_especialidad = ${id_especialidad})
                        AND id_especialidad = ${id_especialidad}
                        LIMIT 1
                    )
                AND im.id_estado_inscripto IS NULL
                ORDER BY im.orden ASC
                LIMIT 1
            `;

        console.log('como va el armaquery en getDocenteProcesoAsignacion: ', armaquery);
        const [result] = await pool.query(armaquery);

        console.log('que trae result getDocenteProcesoAsignacion: ', result);
        res.status(200).json(result);        
        
    }catch(error){
        res.status(400).send(error.message);
    }

};