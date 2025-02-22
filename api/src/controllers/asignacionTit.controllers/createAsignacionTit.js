const pool = require('../../database/connection.js');

module.exports = async(req, res)=>{
    //CREA UNA ASIGNACION DE UN INSCRIPTO A UNA VACANTE
    //EN UNA PRIMERA INSTANCIA SOLO SE CREA LA ASINGACION
    //VER SI SE DEBE MODIFICAR LA ASIGNACION
    const{id_vacante_tit, id_inscripto_tit, datetime_asignacion} = req.body;
    
    console.log('que trae id_vacante_tit: ', id_vacante_tit);
    console.log('que trae id_inscripto_tit: ', id_inscripto_tit);
    console.log('que trae datetime_asignacion: ', datetime_asignacion);

    try{
        const result = await pool.query(`INSERT INTO asignacion_tit(id_vacante_tit, id_inscripto_tit, datetime_asignacion) VALUES(${id_vacante_tit}, ${id_inscripto_tit}, '${datetime_asignacion}'); `);

        const [rows] = await pool.query('SELECT LAST_INSERT_ID() AS id_asignacion_tit');
        const id_asignacion_tit = rows[0].id_asignacion_tit;

        console.log(result);

        res.status(200).json({
            message:'Asignacion Titular Creada',
            id_asignacion_tit:id_asignacion_tit,
            id_vacante_tit:id_vacante_tit,
            id_inscripto_tit:id_inscripto_tit,
            datetime_asignacion:datetime_asignacion
        });

    }catch(error){
        res.status(400).send(error.message);
    }

};