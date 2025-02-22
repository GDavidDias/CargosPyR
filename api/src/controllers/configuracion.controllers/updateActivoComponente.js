const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //MODIFICA EL CAMPO ACTIVO DE UN COMPONENTE
    //const{idComponente} = req.params;
    
    const{idComponente, estadoActivo} = req.body;
    console.log('que ingresa por idComponente: ', idComponente);
    console.log('que trae estadoActivo: ', estadoActivo);

    try{
        const [result] = await pool.query(`UPDATE config_component_active SET active='${estadoActivo}'
             WHERE id_component=${idComponente}; `);

        console.log('que trae result updateActivoComponente: ', result);

        res.status(200).json({
            message:'Estado Componente Actualizado',
            idComponente : idComponente,
            estadoActivo : estadoActivo
        });
        
    }catch(error){
        res.status(400).send(error.message);
    }

};