const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //VALIDA QUE EL LEGAJO DE UN INSCRIPTO ESTE EN DISPONIBILIDAD
    //QUE SEAN DEL NIVEL INDICADO EN EL LISTADO id_listado_inscriptos
    console.log('ingresa a validateLegajoDisponibilidad');
    const {id_listado_inscriptos, legajoInscripto} = req.body;

    console.log('que trae id_listado_inscriptos: ', id_listado_inscriptos);
    console.log('que trae legajoInscripto: ', legajoInscripto);


    let armaquery=`SELECT im.id_inscriptos_mov, im.dni, im.apellido, im.nombre, im.total, im.legajo, im.id_tipo_inscripto, ti.descripcion AS tipoinscripto, im.id_listado_inscriptos, li.descripcion, im.id_vacante_generada_cargo_actual
            FROM inscriptos_mov AS im
            LEFT JOIN tipo_inscripto AS ti ON im.id_tipo_inscripto = ti.id_tipo_inscripto
            LEFT JOIN listado_inscriptos AS li ON im.id_listado_inscriptos = li.id_listado_inscriptos

            `;

    armaquery += `WHERE im.id_listado_inscriptos = ${id_listado_inscriptos}
                AND im.legajo = ${legajoInscripto}
                AND im.id_tipo_inscripto = 1
            `;            

    try{
        const [result] = await pool.query(`${armaquery}`);

        console.log('que trae result validateLegajoDisponibilidad: ', result);


        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};