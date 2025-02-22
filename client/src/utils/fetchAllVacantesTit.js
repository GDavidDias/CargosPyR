import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchAllVacantesTit = async(id_listado,limit,page,filtroAsignacion,filtroEspecialidad,valorBusqueda, filtroModalidad, filtroRegion ) => {
    const dataBody={
        "idListadoVacTit":id_listado,
        "limit":limit,
        "page":page,
        "filtroAsignacion":filtroAsignacion,
        "filtroEspecialidad":filtroEspecialidad,
        "filtroBusqueda":valorBusqueda,
        "filtroRegion":filtroRegion,
        "filtroModalidad":filtroModalidad
    };
    console.log('que tiene datos que pasa a body en fetchAllVacantesTit: ', dataBody);

    try{
        const {data} = await axios.post(`${URL}/api/allvacantestit`,dataBody);
        console.log('que trae data de fetchAllVacantesTit: ', data);
        return data;
        
    }catch(error){
        console.log('error en fetchAllVacantesTit: ', error.message);
    }
};