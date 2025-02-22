const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE DATOS DE VACANTES ASIGNADA A UN INSCRIPTO SEGUN EL ID de VACANTE
    const {idVacanteTit} = req.params;
    console.log('que trae idVacanteTit: ', idVacanteTit);
    
    try{
        //TRAE LOS DATOS DEL INSCRIPTO QUE SE ASIGNO LA VACANTE

        const [result] = await pool.query(`SELECT vt.id_vacante_tit, at.datetime_asignacion , at.id_inscripto_tit, it.apellido, it.nombre, it.dni
            FROM vacantes_tit AS vt
            LEFT JOIN asignacion_tit AS at ON vt.id_vacante_tit = at.id_vacante_tit
            LEFT JOIN inscriptos_tit AS it ON at.id_inscripto_tit = it.id_inscriptos_tit
            WHERE (vt.obs_desactiva IS NULL OR vt.obs_desactiva = "")
            AND vt.id_vacante_tit=${idVacanteTit}
            AND  at.obs_desactiva IS NULL`);

        console.log('que trae result getVacanteTitAsignadaInscripto: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};