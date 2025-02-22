import axios from 'axios';
import { URL } from '../../varGlobal';


export const validaLegajoAsignadoListado = async(id_listado,legajo) => {
    const dataBody={
        "id_listado_inscriptos":id_listado,
        "legajoInscripto":legajo
    };
    //console.log('que tiene datos que pasa a body en validaLegajoAsignadoListado: ', dataBody);

    try{
        const {data} = await axios.post(`${URL}/api/validatelegajoasignado`,dataBody);
        //console.log('que trae data de fetchAllVacantesTit: ', data);
        return data;
        
    }catch(error){
        console.log('error en validatelegajoasignado: ', error.message);
    }
};