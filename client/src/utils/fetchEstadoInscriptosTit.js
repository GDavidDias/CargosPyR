import axios from 'axios';
import { URL } from '../../varGlobal';


export const fetchEstadoInscriptosTit = async(id_listado,limit,page) => {
    const dataBody={
        "id_listado_inscriptos":id_listado,
        "limit":limit,
        "page":page
    };
    //console.log('que tiene datos que pasa a body en fetchEstadoInscriptosTit: ', dataBody);

    try{
        const {data} = await axios.post(`${URL}/api/repoestadoinscriptostit`,dataBody);
        //console.log('que trae data de fetchEstadoInscriptosTit: ', data);
        return data;
        
    }catch(error){
        console.log('error en fetchEstadoInscriptosTit: ', error.message);
    }
};