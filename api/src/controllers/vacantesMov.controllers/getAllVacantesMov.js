const pool = require('../../database/connection.js');

module.exports = async(req,res)=>{
    //TRAE TODAS LAS VACANTES DE MOVIMIENTOS SEGUN EL NIVEL INDICADO EN EL LISTADO_VAC_MOV
    const{idListadoVacMov,limit,page,filtroAsignacion,filtroBusqueda,filtroEspecialidad} = req.body;
    console.log('que trae idListadoVacMov: ', idListadoVacMov);
    console.log('que trae limit: ', limit);
    console.log('que trae page: ', page);
    console.log('que trae filtroAsignacion: ', filtroAsignacion);
    console.log('que trae filtroBusqueda: ', filtroBusqueda);

    const offset = (page-1)*limit;

    let armaquery=`SELECT vm.id_vacante_mov, vm.id_listado_vac_mov, vm.orden, vm.establecimiento, vm.obs_establecimiento, vm.region, vm.departamento, vm.localidad, vm.cargo, vm.turno, vm.modalidad, vm.cupof, vm.id_especialidad, vm.datetime_creacion, vm.obs_desactiva, vm.zona, vm.resolucion, am2.datetime_asignacion , am2.id_estado_asignacion
            FROM vacantes_mov AS vm
            LEFT JOIN (SELECT am.id_vacante_mov, am.datetime_asignacion , am.id_estado_asignacion FROM asignacion_mov AS am WHERE am.obs_desactiva IS NULL) AS am2 ON vm.id_vacante_mov = am2.id_vacante_mov
            WHERE (vm.obs_desactiva IS NULL OR vm.obs_desactiva = "")
            AND vm.id_listado_vac_mov=${idListadoVacMov}
            `;

    if(filtroEspecialidad && filtroEspecialidad!=''){
        armaquery += ` AND vm.id_especialidad IN(${filtroEspecialidad}) `
    };

    if(filtroAsignacion==='asignadas'){
        armaquery+=` AND am2.datetime_asignacion IS NOT NULL`;
    }else if(filtroAsignacion==='disponibles'){
        armaquery+=` AND am2.datetime_asignacion IS NULL`;
    };

    if(filtroBusqueda && filtroBusqueda!=''){
        armaquery+=` AND (LOWER(vm.establecimiento) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                            OR LOWER(vm.obs_establecimiento) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                            OR LOWER(vm.cargo) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                            OR LOWER(vm.modalidad) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                            OR LOWER(vm.turno) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                            OR LOWER(vm.region) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                            OR LOWER(vm.departamento) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                            OR LOWER(vm.localidad) LIKE '%${filtroBusqueda.toLowerCase()}%' 
                    ) `
    }

    armaquery+= ` ORDER BY vm.id_vacante_mov ASC`

    try{

        const [result] = await pool.query(`${armaquery} LIMIT ${limit} OFFSET ${offset}`);

        console.log('que trae result getAllVacantesMov: ', result);

        const [totalRows]= await pool.query(`SELECT COUNT(*) AS count FROM (${armaquery}) AS vacantes`)

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