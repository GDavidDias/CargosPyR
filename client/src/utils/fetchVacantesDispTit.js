import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchVacantesDispTit = async(id_listado,limit,page,valorBusqueda,filtroEspecialidad,orderBy) => {
    const dataBody={
        "idListadoVacTit":id_listado,
        "limit":limit,
        "page":page,
        "filtroBusqueda":valorBusqueda,
        "filtroEspecialidad":filtroEspecialidad,
        "orderBy":orderBy
    };
    //console.log('que tiene datos que pasa a body en fetchVacantesDispTit: ', dataBody);


    try{
        const {data} = await axios.post(`${URL}/api/vacantesdisptit`,dataBody);
        //console.log('que trae data de fetchVacantesDispTit: ', data);
        return data;
        
    }catch(error){
        console.log('error en fetchVacantesDispTit: ', error.message);
    }
};