const pool = require('../../database/connection.js');

module.exports = async(req, res)=>{
    //CREA UNA VACANTE DE TITULARIZACION
    const{id_listado_vac_tit, orden, nro_establecimiento, nombre_establecimiento, region, departamento, localidad, cargo, turno, modalidad, cupof, id_especialidad, datetime_creacion, zona} = req.body;
    console.log('que trae id_listado_vac_tit: ', id_listado_vac_tit);
    console.log('que trae orden: ', orden);
    console.log('que trae nro_establecimiento: ', nro_establecimiento);
    console.log('que trae nombre_establecimiento: ', nombre_establecimiento);
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
        const result = await pool.query(`INSERT INTO vacantes_tit(id_listado_vac_tit, orden, nro_establecimiento, nombre_establecimiento, region, departamento, localidad, cargo, turno, modalidad, cupof, id_especialidad, datetime_creacion, zona) VALUES(${id_listado_vac_tit}, ${orden}, '${nro_establecimiento}', '${nombre_establecimiento}', '${region}', '${departamento}', '${localidad}', '${cargo}', '${turno}', '${modalidad}', '${cupof}', ${id_especialidad}, '${datetime_creacion}', '${zona}'); `);

        const [rows] = await pool.query('SELECT LAST_INSERT_ID() AS id_vacantes_tit');
        const id_vacantes_tit = rows[0].id_vacantes_tit;

        console.log(result);

        res.status(200).json({
            message:'Vacante Titularizacion Creada',
            id_vacantes_tit:id_vacantes_tit,
            id_listado_vac_tit:id_listado_vac_tit, 
            orden:orden, 
            nro_establecimiento:nro_establecimiento, 
            nombre_establecimiento:nombre_establecimiento, 
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