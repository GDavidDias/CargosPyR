const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //MODIFICA UN INSCRIPTO
    const{idInscriptoTit} = req.params;
    console.log('que trae idInscriptoTit: ', idInscriptoTit);

    const{dni, apellido, nombre, total, orden, id_especialidad} = req.body;
    
    console.log('que trae dni: ', dni);
    console.log('que trae apellido: ', apellido);
    console.log('que trae nombre: ', nombre);
    console.log('que trae total: ', total);
    console.log('que trae orden: ', orden);
    console.log('que trae id_especialidad: ', id_especialidad);

    try{
        const [result] = await pool.query(`UPDATE inscriptos_tit SET dni='${dni}', apellido='${apellido}', nombre='${nombre}', total='${total}', orden=${orden}, id_especialidad=${id_especialidad}  
            WHERE id_inscriptos_tit = ${idInscriptoTit} `);
        
        console.log('que trae result editInscriptoTit: ', result);

        res.status(200).json({
            message:'Inscripto de TItularizacion Actualizada',
            dni:dni, 
            apellido:apellido, 
            nombre:nombre, 
            total:total, 
            orden:orden, 
            id_especialidad:id_especialidad
        });

    }catch(error){
        res.status(400).send(error.message);
    }


};