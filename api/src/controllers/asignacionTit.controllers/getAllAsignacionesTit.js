const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODAS LAS DESIGNACIONES REALIZADAS EN LA TABLA asignacion_mov
    const {limit,page} = req.body;
    console.log('que trae limit: ', limit);
    console.log('que trae page: ', page);

    const offset = (page-1)*limit;

//+------------------------+--------------+------+-----+---------+----------------+
//| Field                  | Type         | Null | Key | Default | Extra          |
//+------------------------+--------------+------+-----+---------+----------------+
//| id_asignacion_tit      | int          | NO   | PRI | NULL    | auto_increment |
//| id_vacante_tit         | int          | YES  |     | NULL    |                |
//| id_inscripto_tit       | int          | YES  |     | NULL    |                |
//| datetime_asignacion    | datetime     | YES  |     | NULL    |                |
//| id_estado_asignacion   | int          | YES  |     | NULL    |                |
//| observaciones          | varchar(250) | YES  |     | NULL    |                |
//| datetime_actualizacion | datetime     | YES  |     | NULL    |                |
//| obs_desactiva          | varchar(250) | YES  |     | NULL    |                |
//+------------------------+--------------+------+-----+---------+----------------+

    let armaquery=`
    SELECT at.id_asignacion_tit, at.id_vacante_tit, at.id_inscripto_tit, at.datetime_asignacion, it.apellido, it.nombre, it.dni, it.total, it.tomo_cargo, vt.cargo as cargo_destino, vt.turno as turno_destino, vt.nro_establecimiento as establecimiento_destino, vt.nombre_establecimiento as obs_establecimiento_destino, vt.modalidad as modalidad_destino, vt.cupof, vt.region as region_destino, vt.localidad as localidad_destino, vt.zona as zona_destino
            FROM asignacion_tit AS at
            LEFT JOIN inscriptos_tit AS it ON at.id_inscripto_tit = it.id_inscriptos_tit
            LEFT JOIN vacantes_tit AS vt ON at.id_vacante_tit = vt.id_vacante_tit
            wHERE at.obs_desactiva IS NULL
            ORDER BY at.datetime_asignacion DESC
    `;
    
    try{
        console.log('como va el armaquery en getAllAsignacionesMov: ', armaquery);
        const [result] = await pool.query(`${armaquery} LIMIT ${limit} OFFSET ${offset}`);

        //console.log('que trae result getAllAsignacionesMov: ', result);

        const [totalRows]= await pool.query(`SELECT COUNT(*) AS count FROM (${armaquery}) AS inscriptos`);

        const totalPages= Math.ceil(totalRows[0]?.count/limit);
        const totalItems=totalRows[0]?.count;

        res.status(200).json({
            result:result,
            paginacion:{
                page:page,
                limit:limit,
                totalPages:totalPages,
                totalItems:totalItems
            }

        });
        
    }catch(error){
        res.status(400).send(error.message);
    }

};