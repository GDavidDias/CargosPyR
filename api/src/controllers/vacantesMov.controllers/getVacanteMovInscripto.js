const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE DATOS DE VACANTES SOLO SI ES DE UN INSCRIPTO QUE GENERO SU CARGO_ORIGEN
    const {idVacanteMov} = req.params;
    console.log('que trae idVacanteMov: ', idVacanteMov);
    
    try{
        //TRAE LOS DATOS DE UNA VACANTE DE INSCRIPTO GENERADA

        const [result] = await pool.query(`SELECT vm.id_vacante_mov, vm.orden, vm.establecimiento, vm.obs_establecimiento, vm.region, vm.departamento, vm.localidad, vm.cargo, vm.turno, vm.modalidad, vm.cupof, vm.zona, im.id_inscriptos_mov, im.apellido, im.nombre, im.dni
            FROM vacantes_mov AS vm
            JOIN inscriptos_mov AS im ON vm.id_vacante_mov = im.id_vacante_generada_cargo_actual
            WHERE (vm.obs_desactiva IS NULL OR vm.obs_desactiva = "")
            AND vm.id_vacante_mov=${idVacanteMov}
            `);

        console.log('que trae result getVacanteMovInscripto: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};