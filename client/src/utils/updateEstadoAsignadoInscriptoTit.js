import axios from 'axios';
import { URL } from '../../varGlobal';


export const updEstadoAsignadoInscriptoTit = async(idInscriptoTit, idEstado) => {
    const dataBody = {
        idEstadoInscripto:idEstado
    }
    console.log('que tiene dataBody a updEstdoAsignadoInscriptoTit: ', dataBody);
    try{
        const {data} = await axios.put(`${URL}/api/updestadoinscriptotit/${idInscriptoTit}`,dataBody);
        console.log('que trae data de updateEstadoAsignadoInscripto: ', data);
        return data;
        
    }catch(error){
        console.log('error en updateEstadoAsignadoInscripto: ', error.message);
    }
};