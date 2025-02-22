const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    const{username, password} = req.body;
    console.log('que viene en username: ', username);
    console.log('que viene en password: ', password);

    try{
        const [result] = await pool.query(`SELECT u.id_usuario, u.nombre, u.username, u.permiso, u.nivel
            FROM usuarios AS u 
            WHERE u.username='${username}' AND u.password='${password}';`);

        console.log('que trae result validateuser: ', result);

        res.status(200).json(result);
        
    }catch(error){
        res.status(400).send(error.message);
    }
    
};