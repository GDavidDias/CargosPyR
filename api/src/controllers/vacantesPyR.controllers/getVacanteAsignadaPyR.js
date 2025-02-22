const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE DATOS DE VACANTES ASIGNADA SEGUN EL ID de VACANTE
    const {idVacantePyR} = req.params;
    console.log('que trae idVacantePyR: ', idVacantePyR);
    
    try{
        //TRAE LOS DATOS DE UNA VACANTE ASIGNADA

        const [result] = await pool.query(`SELECT vpr.id_vacante_pr, vpr.id_listado_vac_pr, vpr.orden, vpr.nro_establecimiento, vpr.nombre_establecimiento, vpr.region, vpr.departamento, vpr.localidad, vpr.cargo, vpr.turno, vpr.modalidad, vpr.cupof, vpr.caracter, vpr.motivo_cobertura, vpr.desde, vpr.hasta, vpr.zona, vpr.id_especialidad, e.descripcion AS especialidad, vpr.resolucion, at.datetime_asignacion , apr.id_asignacion_pr
            FROM vacantes_pr AS vpr
            LEFT JOIN asignacion_pr AS apr ON vpr.id_vacante_pr = apr.id_vacante_pr
            LEFT JOIN especialidad as e ON vpr.id_especialidad = e.id_especialidad
            WHERE (vpr.obs_desactiva IS NULL OR vpr.obs_desactiva = "")
            AND vpr.id_vacante_pr=${idVacantePyR}
            AND  apr.obs_desactiva IS NULL`);

        console.log('que trae result getVacanteAsignadaPyR: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }

};