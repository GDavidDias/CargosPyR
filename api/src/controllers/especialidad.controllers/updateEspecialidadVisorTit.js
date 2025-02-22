const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //MODIFICA EL CAMPO ACTIVO DE UNA ESPECIALIDAD
    //const{idComponente} = req.params;
    
    const{idEspecialidad, activoVisor} = req.body;
    console.log('que ingresa por idEspecialidad: ', idEspecialidad);
    console.log('que trae activoVisor: ', activoVisor);

    try{
        const [result] = await pool.query(`UPDATE especialidad SET activo_visor_tit='${activoVisor}'
             WHERE id_especialidad=${idEspecialidad}; `);

        console.log('que trae result updateEspecialidadVisorTit: ', result);

        res.status(200).json({
            message:'Estado Especialidad Visor Actualizado',
            idEspecialidad : idEspecialidad,
            activoVisor : activoVisor
        });
        
    }catch(error){
        res.status(400).send(error.message);
    }

};