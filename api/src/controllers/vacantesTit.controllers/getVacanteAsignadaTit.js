const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE DATOS DE VACANTES ASIGNADA SEGUN EL ID de VACANTE
    const {idVacanteTit} = req.params;
    console.log('que trae idVacanteTit: ', idVacanteTit);
    
    try{
        //TRAE LOS DATOS DE UNA VACANTE ASIGNADA

        const [result] = await pool.query(`SELECT vt.id_vacante_tit, vt.id_listado_vac_tit, vt.orden, vt.nro_establecimiento, vt.nombre_establecimiento, vt.region, vt.departamento, vt.localidad, vt.cargo, vt.turno, vt.modalidad, vt.cupof, vt.zona, vt.id_especialidad, e.descripcion AS especialidad, vt.resolucion, at.datetime_asignacion , at.id_asignacion_tit
            FROM vacantes_tit AS vt
            LEFT JOIN asignacion_tit AS at ON vt.id_vacante_tit = at.id_vacante_tit
            LEFT JOIN especialidad as e ON vt.id_especialidad = e.id_especialidad
            WHERE (vt.obs_desactiva IS NULL OR vt.obs_desactiva = "")
            AND vt.id_vacante_tit=${idVacanteTit}
            AND  at.obs_desactiva IS NULL`);

        console.log('que trae result getVacanteAsignadaTit: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};