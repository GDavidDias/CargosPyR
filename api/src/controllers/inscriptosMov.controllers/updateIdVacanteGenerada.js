const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //ACTUALIZA EL ID DE VACANTE GENERADA DEL CARGO ORIGINAL QUE DEJA
    const{idInscriptoMov} = req.params;
    console.log('que trae idInscriptoMov: ', idInscriptoMov);

    const{idVacanteGenerada} = req.body;
    console.log('que trae idVacanteGenerada: ', idVacanteGenerada);

    try{
        const [result] = await pool.query(`UPDATE inscriptos_mov 
            SET id_vacante_generada_cargo_actual = ${idVacanteGenerada}
            WHERE id_inscriptos_mov = ${idInscriptoMov} `);

        console.log('que trae result updateIdVacanteGenerada: ', result);

        res.status(200).json({
            message:'id_vacante_generada_cargo_actual actualizado'
        });

    }catch(error){
        res.status(400).send(error.message);
    }


};