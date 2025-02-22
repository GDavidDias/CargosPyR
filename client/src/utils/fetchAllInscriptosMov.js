import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchAllInscriptosMov = async(id_listado,limit,page,idTipoInscripto,filtroAsignacion,valorBusqueda,idListadoCompara,especialidadLuom) => {
    let valoresInscripto;
    if(idTipoInscripto===1){
        valoresInscripto="1";
    }else{
        valoresInscripto="2,3"
    }
    const dataBody={
        "id_listado_inscriptos":id_listado,
        "limit":limit,
        "page":page,
        "idTipoInscripto":valoresInscripto,
        "filtroAsignacion":filtroAsignacion,
        "filtroBusqueda":valorBusqueda,
        "idListadoInscriptosCompara":idListadoCompara,
        "idEspecialidadLuom":especialidadLuom
    };
    //console.log('que tiene datos que pasa a body en fetchAllInscriptosMov: ', dataBody);

    try{
        const {data} = await axios.post(`${URL}/api/inscriptosmov`,dataBody);
        //console.log('que trae data de fetchAllInscriptosMov: ', data);
        return data;
        
    }catch(error){
        console.log('error en fetchAllInscriptosMov: ', error);
    }
};