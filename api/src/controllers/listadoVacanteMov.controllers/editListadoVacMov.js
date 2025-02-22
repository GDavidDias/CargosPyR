const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //MODIFICAR UN LISTADO DE MOVIMIENTO
    const{idListadoVacMov} = req.params;
    console.log('que trae idListadoVacMov: ', idListadoVacMov);

    const{año, id_nivel, resolucion, descripcion} = req.body;
    console.log('que trae año: ', año);
    console.log('que trae idNivel: ', id_nivel);
    console.log('que trae resolucion: ', resolucion);
    console.log('que trae descripcion: ', descripcion);

    try{
        const [result] = await pool.query(`UPDATE listado_vacantes_mov SET año='${año}', id_nivel=${id_nivel}, resolucion='${resolucion}', descripcion='${descripcion}' 
            WHERE id_listado_vac_mov = ${idListadoVacMov} `);

        console.log('que trae result editListadoVacMov: ', result);

        res.status(200).json({
            message:'Listado de Vacantes de Movimientos Actualizada',
            año:año, 
            id_nivel:id_nivel,
            resolucion:resolucion, 
            descripcion:descripcion
        });
    }catch(error){
        res.status(400).send(error.message);
    }

};