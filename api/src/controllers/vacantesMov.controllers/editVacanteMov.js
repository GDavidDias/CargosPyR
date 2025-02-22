const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //MODIFICA UNA VACANTE DE MOVIMIENTOS
    const{idVacanteMov} = req.params;
    console.log('que ingresa por idVancanteMov: ', idVacanteMov);
    
    const{establecimiento, obs_establecimiento, region, departamento, localidad, cargo, turno, modalidad, cupof,zona} = req.body;
    //console.log('que trae id_listado_vac_mov: ', id_listado_vac_mov);
    //console.log('que trae orden: ', orden);
    console.log('que trae establecimiento: ', establecimiento);
    console.log('que trae obs_establecimiento: ', obs_establecimiento);
    console.log('que trae region: ', region);
    console.log('que trae departamento: ', departamento);
    console.log('que trae localidad: ', localidad);
    console.log('que trae cargo: ', cargo);
    console.log('que trae turno: ', turno);
    console.log('que trae modalidad: ', modalidad);
    console.log('que trae cupof: ', cupof);
    //console.log('que trae id_especialidad: ', id_especialidad);
    //console.log('que trae datetime_creacion: ', datetime_creacion);
    //console.log('que trae obs_desactiva: ', obs_desactiva);
    console.log('que trae zona: ', zona);

    try{
        const [result] = await pool.query(`UPDATE vacantes_mov SET establecimiento='${establecimiento}', obs_establecimiento='${obs_establecimiento}', region='${region}', departamento='${departamento}', localidad='${localidad}', cargo='${cargo}', turno='${turno}', modalidad='${modalidad}', cupof='${cupof}', zona='${zona}' WHERE id_vacante_mov='${idVacanteMov}'; `);

        console.log('que trae result editVacanteMov: ', result);

        res.status(200).json({
            message:'Vacante Actualizada',
            establecimiento:establecimiento, 
            obs_establecimiento:obs_establecimiento, 
            region:region, 
            departamento:departamento, 
            localidad:localidad, 
            cargo:cargo, 
            turno:turno, 
            modalidad:modalidad, 
            cupof:cupof, 
            zona:zona
        });
        
    }catch(error){
        res.status(400).send(error.message);
    }

};