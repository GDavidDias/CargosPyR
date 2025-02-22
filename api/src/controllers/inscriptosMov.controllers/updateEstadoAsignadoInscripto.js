const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //ACTUALIZA EL ID DEL ESTADO ASIGNADO INSCRIPTO
    const{idInscriptoMov} = req.params;
    console.log('que trae idInscriptoMov: ', idInscriptoMov);

    const{idEstadoInscripto} = req.body;
    console.log('que trae idEstadoInscripto: ', idEstadoInscripto);

    try{
        const [result] = await pool.query(`UPDATE inscriptos_mov 
            SET id_estado_inscripto = ${idEstadoInscripto}
            WHERE id_inscriptos_mov = ${idInscriptoMov} `);

        console.log('que trae result updateEstadoAsignadoInscripto: ', result);

        res.status(200).json({
            message:'id_estado_inscripto actualizado'
        });

    }catch(error){
        res.status(400).send(error.message);
    }


};