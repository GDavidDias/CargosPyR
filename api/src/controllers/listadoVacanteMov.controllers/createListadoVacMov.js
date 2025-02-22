const pool = require('../../database/connection.js');

module.exports = async(req, res)=>{
    //CREA UN LISTADO DE VACANTES DE MOVIMIENTO
    const{año, id_nivel, resolucion, descripcion} = req.body;
    console.log('que trae año: ', año);
    console.log('que trae id_nivel: ', id_nivel);
    console.log('que trae resolucion: ', resolucion);
    console.log('que trae descripcion: ', descripcion);

    try{
        const result = await pool.query(`INSERT INTO listado_vacantes_mov(año, id_nivel, resolucion, descripcion) VALUES('${año}', ${id_nivel}, '${resolucion}','${descripcion}'); `);

        const [rows] = await pool.query('SELECT LAST_INSERT_ID() AS id_vacantes_mov');
        const id_listado_vac_mov = rows[0].id_listado_vac_mov;

        console.log(result);

        res.status(200).json({
            message:'Listado Creado',
            id_listado_vac_mov:id_listado_vac_mov,
            año:año,
            id_nivel:id_nivel,
            resolucion:resolucion,
            descripcion:descripcion
        });

    }catch(error){
        res.status(400).send(error.message);
    }
}
