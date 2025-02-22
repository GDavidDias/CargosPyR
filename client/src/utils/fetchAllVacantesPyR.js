import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchAllVacantesPyR = async(id_listado,limit,page,filtroAsignacion,filtroEspecialidad,valorBusqueda, filtroModalidad, filtroRegion ) => {
    const dataBody={
        "idListadoVacPyR":id_listado,
        "limit":limit,
        "page":page,
        "filtroAsignacion":filtroAsignacion,
        "filtroEspecialidad":filtroEspecialidad,
        "filtroBusqueda":valorBusqueda,
        "filtroRegion":filtroRegion,
        "filtroModalidad":filtroModalidad
    };

    console.log('que tiene datos que pasa a body en fetchAllVacantesPyR: ', dataBody);

    try{
        const {data} = await axios.post(`${URL}/api/allvacantespyr`,dataBody);
        console.log('que trae data de fetchAllVacantesPyR: ', data);
        return data;
        
    }catch(error){
        console.log('error en fetchAllVacantesPyR: ', error.message);
    }
};