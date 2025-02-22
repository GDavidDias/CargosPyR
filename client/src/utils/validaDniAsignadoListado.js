import axios from 'axios';
import { URL } from '../../varGlobal';


export const validaDniAsignadoListado = async(id_listado,dni) => {
    const dataBody={
        "id_listado_inscriptos":id_listado,
        "dniInscripto":dni
    };
    //console.log('que tiene datos que pasa a body en validaDniAsignadoListado: ', dataBody);

    try{
        const {data} = await axios.post(`${URL}/api/validatedniasignado`,dataBody);
        //console.log('que trae data de fetchAllVacantesTit: ', data);
        return data;
        
    }catch(error){
        console.log('error en validaDniAsignadoListado: ', error.message);
    }
};