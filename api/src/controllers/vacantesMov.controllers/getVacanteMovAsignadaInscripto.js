const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE DATOS DE VACANTES ASIGNADA A UN INSCRIPTO SEGUN EL ID de VACANTE
    const {idVacanteMov} = req.params;
    console.log('que trae idVacanteMov: ', idVacanteMov);
    
    try{
        //TRAE LOS DATOS DE UNA VACANTE ASIGNADA Y SU INSCRIPTO

        const [result] = await pool.query(`SELECT vm.id_vacante_mov, vm.id_listado_vac_mov, vm.orden, vm.establecimiento, vm.obs_establecimiento, vm.region, vm.departamento, vm.localidad, vm.cargo, vm.turno, vm.modalidad, vm.cupof, vm.zona, am.datetime_asignacion , am.id_inscripto_mov, im.apellido, im.nombre, im.dni
            FROM vacantes_mov AS vm
            LEFT JOIN asignacion_mov AS am ON vm.id_vacante_mov = am.id_vacante_mov
            LEFT JOIN inscriptos_mov AS im ON am.id_inscripto_mov = im.id_inscriptos_mov
            WHERE (vm.obs_desactiva IS NULL OR vm.obs_desactiva = "")
            AND vm.id_vacante_mov=${idVacanteMov}
            AND  am.obs_desactiva IS NULL`);

        console.log('que trae result getVacanteMovAsignadaInscripto: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};