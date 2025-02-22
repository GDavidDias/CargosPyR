import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchVacantesDispMov = async(id_listado,limit,page,valorBusqueda,filtroEspecialidad,orderBy,typeOrder) => {
    const dataBody={
        "idListadoVacMov":id_listado,
        "limit":limit,
        "page":page,
        "filtroBusqueda":valorBusqueda,
        "filtroEspecialidad":filtroEspecialidad,
        "orderBy":orderBy,
        "typeOrder":typeOrder
    };
    //console.log('que tiene datos que pasa a body en fetchVacantesDispMov: ', dataBody);

    try{
        const {data} = await axios.post(`${URL}/api/vacantesdisp`,dataBody);
        //console.log('que trae data de fetchVacantesDispMov: ', data);
        return data;
        
    }catch(error){
        console.log('error en fetchVacantesDispMov: ', error.message);
    }
};