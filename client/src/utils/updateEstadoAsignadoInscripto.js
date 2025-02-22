import axios from 'axios';
import { URL } from '../../varGlobal';


export const updateEstadoAsignadoInscripto = async(idInscriptoMov, idEstado) => {
    const dataBody = {
        idEstadoInscripto:idEstado
    }

    try{
        const {data} = await axios.put(`${URL}/api/updateestadoinscripto/${idInscriptoMov}`,dataBody);
        //console.log('que trae data de updateEstadoAsignadoInscripto: ', data);
        return data;
        
    }catch(error){
        console.log('error en updateEstadoAsignadoInscripto: ', error.message);
    }
};