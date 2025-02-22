import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchAllInscriptosTit = async(id_listado,limit,page,filtroAsignacion,valorBusqueda,filtroEspecialidad) => {
    
    const dataBody={
        "id_listado_inscriptos":id_listado,
        "limit":limit,
        "page":page,
        "filtroAsignacion":filtroAsignacion,
        "filtroBusqueda":valorBusqueda,
        "filtroEspecialidad":filtroEspecialidad
    };
    //console.log('que tiene datos que pasa a body en fetchAllInscriptosTit: ', dataBody);

    try{
        const {data} = await axios.post(`${URL}/api/inscriptostit`,dataBody);
        //console.log('que trae data de fetchAllInscriptosTit: ', data);
        return data;
        
    }catch(error){
        console.log('error en fetchAllInscriptosTit: ', error);
    }
};