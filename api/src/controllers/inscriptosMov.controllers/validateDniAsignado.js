const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //VALIDA QUE EL DNI DE UN INSCRIPTO YA TENGA UNA ASIGNACION VALIDA.
    //QUE SEAN DEL NIVEL INDICADO EN EL LISTADO id_listado_inscriptos
    console.log('ingresa a validateDniAsignado');
    const {id_listado_inscriptos, dniInscripto} = req.body;

    console.log('que trae id_listado_inscriptos: ', id_listado_inscriptos);
    console.log('que trae dniInscripto: ', dniInscripto);


    let armaquery=`SELECT im.dni, count(DISTINCT im.legajo) AS cantidad
            FROM inscriptos_mov AS im
            `;

    armaquery += `WHERE im.id_listado_inscriptos = ${id_listado_inscriptos}
                AND im.dni = ${dniInscripto}
            `;            

    try{
        const [result] = await pool.query(`${armaquery}`);

        console.log('que trae result validateDniAsignado: ', result);


        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};