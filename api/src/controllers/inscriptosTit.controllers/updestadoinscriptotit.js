const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //ACTUALIZA EL ID DEL ESTADO ASIGNADO INSCRIPTO
    const{idInscriptoTit} = req.params;
    console.log('que trae idInscriptoMov: ', idInscriptoTit);

    const{idEstadoInscripto} = req.body;
    console.log('que trae idEstadoInscripto: ', idEstadoInscripto);

    try{
        const [result] = await pool.query(`UPDATE inscriptos_tit 
            SET id_estado_inscripto = ${idEstadoInscripto}
            WHERE id_inscriptos_tit = ${idInscriptoTit} `);

        console.log('que trae result updEstadoInscriptoTit: ', result);

        res.status(200).json({
            message:'id_estado_inscripto actualizado'
        });

    }catch(error){
        res.status(400).send(error.message);
    }


};