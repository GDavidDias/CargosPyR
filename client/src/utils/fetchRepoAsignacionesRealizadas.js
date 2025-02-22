import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchRepoAsignacionesRealizadas = async(id_listado) => {
    const dataBody={
        "idListadoVacMov":id_listado
    };
    //console.log('que tiene datos que pasa a body en fetchRepoAsignacionesRealizadas: ', dataBody);

    try{
        const {data} = await axios.post(`${URL}/api/repoasignacionesrealizadas`,dataBody);
        //console.log('que trae data de fetchRepoAsignacionesRealizadas: ', data);
        return data;
        
    }catch(error){
        console.log('error en fetchRepoAsignacionesRealizadas: ', error.message);
    }
};