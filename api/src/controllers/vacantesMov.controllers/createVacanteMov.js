const pool = require('../../database/connection.js');

module.exports = async(req, res)=>{
    //CREA UNA VACANTE DE MOVIMIENTO
    const{id_listado_vac_mov, orden, establecimiento, obs_establecimiento, region, departamento, localidad, cargo, turno, modalidad, cupof, id_especialidad, datetime_creacion, zona} = req.body;
    console.log('que trae id_listado_vac_mov: ', id_listado_vac_mov);
    console.log('que trae orden: ', orden);
    console.log('que trae establecimiento: ', establecimiento);
    console.log('que trae obs_establecimiento: ', obs_establecimiento);
    console.log('que trae  region: ', region);
    console.log('que trae departamento: ', departamento);
    console.log('que trae localidad: ', localidad);
    console.log('que trae cargo: ', cargo);
    console.log('que trae turno: ', turno);
    console.log('que trae modalidad: ', modalidad);
    console.log('que trae cupof: ', cupof);
    console.log('que trae id_especialidad: ', id_especialidad);
    console.log('que trae datetime_creacion: ', datetime_creacion);
    console.log('que trae zona: ', zona);    
    
    try{
        const result = await pool.query(`INSERT INTO vacantes_mov(id_listado_vac_mov, orden, establecimiento, obs_establecimiento, region, departamento, localidad, cargo, turno, modalidad, cupof, id_especialidad, datetime_creacion, zona) VALUES(${id_listado_vac_mov}, ${orden}, '${establecimiento}', '${obs_establecimiento}', '${region}', '${departamento}', '${localidad}', '${cargo}', '${turno}', '${modalidad}', '${cupof}', ${id_especialidad}, '${datetime_creacion}', '${zona}'); `);

        const [rows] = await pool.query('SELECT LAST_INSERT_ID() AS id_vacantes_mov');
        const id_vacantes_mov = rows[0].id_vacantes_mov;

        console.log(result);

        res.status(200).json({
            message:'Vacante Creada',
            id_vacantes_mov:id_vacantes_mov,
            id_listado_vac_mov:id_listado_vac_mov, 
            orden:orden, 
            establecimiento:establecimiento, 
            obs_establecimiento:obs_establecimiento, 
            region:region, 
            departamento:departamento, 
            localidad:localidad, 
            cargo:cargo, 
            turno:turno, 
            modalidad:modalidad, 
            cupof:cupof, 
            id_especialidad:id_especialidad, 
            datetime_creacion:datetime_creacion, 
            zona:zona
        });

    }catch(error){
        res.status(400).send(error.message);
    }

}