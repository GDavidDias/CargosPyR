const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE SI HAY NULOS EN ESTADO DE MOVIMIENTO PARA LOS INSCRIPTOS QUE ESTAN ANTES 
    //DEL TITULAR EN EL ORDEN DE INSCRIPCION, PARA SABER SI SE PUEDE ASIGNAR O NO LA VACANTE AL TITULAR
    const {id_listado, idTitular, id_especialidad} = req.body;
    console.log('que tiene id_listado: ', id_listado);
    console.log('que tiene idTitular: ', idTitular);
    console.log('que tiene id_especialidad: ', id_especialidad);


    try{
        //TRAE SI HAY NULOS EN ESTADO DE MOVIMIENTO PARA LOS INSCRIPTOS QUE ESTAN ANTES 
        //DEL TITULAR EN EL ORDEN DE INSCRIPCION, PARA SABER SI SE PUEDE ASIGNAR O NO LA VACANTE AL TITULAR
        //BUSCO POR ORDEN DE INSCRIPCION, LOS QUE ESTAN ANTES DEL TITULAR, Y VER SI ALGUNO DE ELLOS TIENE ESTADO DE MOVIMIENTO NULO
        //EL CRITERIO DE BUSQUEDA ES EL ID_LISTADO DE INSCRIPTOS, Y EL ID DEL TITULAR PARA SABER SU ORDEN DE INSCRIPCION,
        //Y SE AGREGA EL ID_ESPECIALIDAD PARA CONTROLAR QUE SOLO BUSQUE LOS INSCRIPTOS DE LA MISMA ESPECIALIDAD, 
        //PORQUE SI HAY NULOS EN OTRO CARGO NO AFECTA LA ASIGNACION

        {/*let armaquery=`SELECT EXISTS(
                    SELECT 1
                    FROM inscriptos_tit im
                    WHERE im.id_listado_inscriptos = ${id_listado} AND im.id_especialidad = ${id_especialidad}
                    AND im.orden < (
                        SELECT orden
                        FROM inscriptos_tit
                        WHERE id_listado_inscriptos = ${id_listado} 
                        AND id_inscriptos_tit = ${idTitular}
                        AND id_especialidad = ${id_especialidad}
                        
                        LIMIT 1
                    )
                    AND im.id_estado_inscripto  IS NULL
                    
                ) AS hay_nulos
            `;*/}
        let armaquery = `
                SELECT im.id_inscriptos_tit, im.apellido, im.orden
                FROM inscriptos_tit im
                WHERE im.id_listado_inscriptos = ${id_listado}  AND im.id_especialidad = ${id_especialidad}
                AND im.orden < (
                        SELECT orden
                        FROM inscriptos_tit
                        WHERE id_listado_inscriptos = ${id_listado}
                        AND id_inscriptos_tit = ${idTitular}
                        AND id_especialidad = ${id_especialidad}
                        LIMIT 1
                    )
                AND im.id_estado_inscripto IS NULL
                ORDER BY im.orden ASC
                LIMIT 1
            `;

        console.log('como va el armaquery en getHayNulosTit: ', armaquery);
        const [result] = await pool.query(armaquery);

        console.log('que trae result getHayNulosTit: ', result);
        res.status(200).json(result);        
        
    }catch(error){
        res.status(400).send(error.message);
    }

};