const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE LOS LISTADOS DE VACANTES DE MOVIMIENTO
    try{
        const [result] = await pool.query(`SELECT lvm.id_listado_vac_mov, lvm.año, lvm.id_nivel, n.descripcion, lvm.resolucion, lvm.descripcion
            FROM listado_vacantes_mov AS lvm
            LEFT JOIN nivel AS n ON lvm.id_nivel = n.id_nivel`);

        console.log('que trae result getListadoVacMov: ', result);

        res.status(200).json(result);

    }catch(error){
        res.status(400).send(error.message);
    }
}